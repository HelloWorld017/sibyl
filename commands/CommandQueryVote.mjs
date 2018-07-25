import CommandQuery from "./CommandQuery";

class CommandQueryVote extends CommandQuery {
	constructor(bot) {
		super(bot, '투표', ['VoteId', 'VoteResult']);
	}

	async doExecute(parsedArgs, callback_query) {
		const chat = this.bot.getChat(callback_query.message.chat.id);
		const vote = chat.votes.find(v => v.voteId === parsedArgs.VoteId);
		if(!vote) return;

		vote.vote(parsedArgs, callback_query);
	}
}

export default CommandQueryVote;
