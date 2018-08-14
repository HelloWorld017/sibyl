import CommandQuery from "./CommandQuery";

class CommandQueryMeal extends CommandQuery {
	constructor(bot) {
		super(bot, "급식", ['SchoolId']);
	}

	async doExecute({SchoolId}, callback_query) {
		const chat = this.bot.getChat(callback_query.message.chat.id);
		chat.config.school = SchoolId;
		await chat.save();
		await this.bot.sendHtml('성공적으로 구독하였습니다!', chat.id);
	}
}

export default CommandQueryMeal;
