import Command from "./Command.mjs";

class CommandHelp extends Command {
	constructor(bot) {
		super(bot, "도움말", ['CommandName']);
	}

	async doExecute({CommandName}, message) {
		if(CommandName) {
			const command = this.bot.commands.find(v => v.commandName === CommandName);
			if(!command) {
				this.bot.sendHtml(`해당하는 명령어가 존재하지 않습니다: ${CommandName}`, message.chat.id);
				return;
			}

			command.sendHelpMessage(message.chat.id);
			return;
		}

		let helpMessage = `명령어 목록\n\n`;

		this.bot.commands.filter(v => v.listed).forEach(command => {
			const argList = command.argTypes.map(v => this.bot.types[v].getInformation()).join(' ');

			helpMessage += `!${command.commandName} ${argList}\n`;
			helpMessage += `<i>${command.getDescription()}</i>\n\n`;
		});

		await this.bot.sendHtml(helpMessage, message.chat.id);
	}

	getDescription() {
		return '명령어 목록 또는 자세한 설명을 불러옵니다.';
	}

	getArgsDescription() {
		return {
			CommandName: '(선택) 명령어 이름'
		};
	}

	get strictLen() {
		return false;
	}

	get aliases() {
		return ['도움말'];
	}
}

export default CommandHelp;
