class Command {
	constructor(bot, commandName, argTypes) {
		this.bot = bot;
		this.commandName = commandName;
		this.argTypes = argTypes;
	}

	isStatementCommand(statement) {
		if(statement.startsWith(`!${this.commandName}`)) return true;
		return false;
	}

	sendHelpMessage(userId) {
		const argList = this.argTypes.map(v => v.getShape()).join(' ');
		const descriptions = this.getArgsDescription();

		let helpMessage = `!${this.commandName} ${argList}<br>`;
		helpMessage += `<i>${this.getDescription()}</i><br><br>`;
		helpMessage += Object.keys(descriptions)
			.map(k => `<code>${this.bot.types[k]}</code>: ${descriptions[k]}<br>`);

		this.bot.sendHtml(helpMessage, userId);
	}

	execute(args, message) {
		const argsList = args.slice(2 + this.commandName.length).split(' ');
		if(argsList.length !== this.argTypes.length) {
			this.sendHelpMessage(message.chat.id);
			return;
		}

		let lastError = null;

		const parsedArgs = argsList.reduce((parsed, arg, i) => {
			if(lastError) return;

			const argType = this.argTypes[i];
			try {
				const chunk = this.bot.types[argType].parse(arg, this.bot.types);
			} catch(e) {
				lastError = e;
			}

			Object.keys(chunk).forEach(k => parsed[k] = chunk[k]);
			return parsed;
		}, {});

		if(lastError) {
			this.bot.sendHtml(lastError.message, message.chat.id);
			return;
		}

		this.doExecute(parsedArgs, message);
	}

	doExecute(parsedArgs, message) {}

	getArgsDescription() {
		return {};
	}
}

export default Command;
