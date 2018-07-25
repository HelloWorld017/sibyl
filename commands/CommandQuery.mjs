import Command from "./Command";

class CommandQuery extends Command {
	isStatementCommand(update) {
		if(!update.callback_query || !update.callback_query.data) return false;
		return update.callback_query.data.startsWith(`${this.commandName}:`);
	}

	sendHelpMessage(userId) {}

	async execute({callback_query}) {
		const {data} = callback_query;
		const argsList = data.split(':').slice(1);
		if(argsList.length !== this.argTypes.length) {
			return;
		}

		let lastError = null;

		const parsedArgs = argsList.reduce((parsed, arg, i) => {
			if(lastError) return;

			const argType = this.argTypes[i];
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
			console.log('e', lastError);
			return;
		}

		await this.doExecute(parsedArgs, callback_query);
	}

	async doExecute(parsedArgs, callback_query) {}

	getArgsDescription() {
		return {};
	}

	get listed() {
		return false;
	}
}

export default CommandQuery;
