const findCommand = message => v => {
	return message.startsWith(`!${v} `) ||
		message === `!${v}`;
}

class Command {
	constructor(bot, commandName, argTypes) {
		this.bot = bot;
		this.commandName = commandName;
		this.argTypes = argTypes;
	}

	isStatementCommand(update) {
		if(!update.message || !update.message.text) return false;

		return this.commandNames.some(findCommand(update.message.text));
	}

	sendHelpMessage(userId, prefix='') {
		const argList = this.argTypes.map(v => this.bot.types[v].getInformation()).join(' ');
		const descriptions = this.getArgsDescription();

		let helpMessage = prefix;
		helpMessage += `!${this.commandName} ${argList}\n`;
		helpMessage += this.aliases.length > 0 ? `(${this.aliases.map(v => `!${v}`).join(', ')})\n` : '';
		helpMessage += `<i>${this.getDescription()}</i>\n\n`;
		helpMessage += Object.keys(descriptions)
			.map(k => `<code>${this.bot.types[k].name}</code>: ${descriptions[k]}\n`).join('');

		this.bot.sendHtml(helpMessage, userId);
	}

	async execute({message}) {
		const {text} = message;
		const commandName = this.commandNames.find(findCommand(text));
		const rawArgs = text.slice(2 + commandName.length);
		const argsList = rawArgs.split(' ').filter(v => v.length);

		if(this.strictLen && argsList.length !== this.argTypes.length) {
			this.sendHelpMessage(message.chat.id, '잘못된 사용법: \n\n');
			return;
		}

		let lastError = null;
		const parsedArgs = argsList.reduce((parsed, arg, i) => {
			if(lastError) return;

			const argType = this.argTypes[i];
			if(!this.bot.types[argType]) return parsed;

			let chunk;
			try {
				chunk = this.bot.types[argType].parse(this.bot.types, arg);
			} catch(e) {
				lastError = e;
				return;
			}

			Object.keys(chunk).forEach(k => parsed[k] = chunk[k]);
			return parsed;
		}, {});

		if(lastError) {
			this.bot.sendHtml('명령어 처리 중 오류가 발생하였습니다. : ' + lastError.message, message.chat.id);
			return;
		}

		try {
			await this.doExecute(parsedArgs, message, rawArgs);
		} catch(e) {
			console.error(e);
			await this.bot.sendHtml('명령어 처리 중 오류가 발생하였습니다. : ' + e.message, message.chat.id);
		}
	}

	doExecute(parsedArgs, message) {}

	getArgsDescription() {
		return {};
	}

	get listed() {
		return true;
	}

	get strictLen() {
		return true;
	}

	get aliases() {
		return [];
	}

	get commandNames() {
		return this.aliases.concat(this.commandName);
	}
}

export default Command;
