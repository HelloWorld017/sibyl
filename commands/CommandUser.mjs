import Command from "./Command.mjs";

class CommandUser extends Command {
	constructor(bot) {
		super(bot, "범죄계수", []);
	}

	async doExecute(_, message) {
		const chatId = message.chat.id;
		const chat = this.bot.getChat(chatId);

		let usersList = `범죄계수 목록\n\n`

		Object.keys(chat.users).sort((a, b) => {
			return chat.users[b].coefficient - chat.users[a].coefficient;
		}).forEach(k => {
			const v = chat.users[k];

			usersList += `${v.first_name || ''} ${v.last_name || ''} (${v.username}): ` +
				`<code>${v.coefficient}</code>\n`;
		});

		await this.bot.sendHtml(usersList, message.chat.id);
	}

	getDescription() {
		return '범죄계수 목록을 불려옵니다.';
	}

	getArgsDescription() {
		return {};
	}
}

export default CommandUser;
