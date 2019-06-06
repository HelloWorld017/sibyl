import CommandQuery from "./CommandQuery.mjs";

class CommandQueryRefreshVote extends CommandQuery {
	constructor(bot) {
		super(bot, '투표새로고침', ['VoteId']);
	}

	async doExecute({VoteId}, callback_query) {
		const chat = this.bot.getChat(callback_query.message.chat.id);
		const vote = chat.votes.find(v => v.voteId === VoteId);
		if(!vote) return;

		await vote.createNewVoteMessage();
	}
}

export default CommandQueryRefreshVote;
