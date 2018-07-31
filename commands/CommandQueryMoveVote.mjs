import CommandQuery from "./CommandQuery";

class CommandQueryMoveVote extends CommandQuery {
	constructor(bot) {
		super(bot, '투표이동', ['VoteId']);
	}

	async doExecute({VoteId}, callback_query) {
		const chat = this.bot.getChat(callback_query.message.chat.id);
		const vote = chat.votes.find(v => v.voteId === VoteId);
		if(!vote) return;

		await this.bot.sendHtml()
		vote.vote(parsedArgs, callback_query);
	}
}

export default CommandQueryMoveVote;
