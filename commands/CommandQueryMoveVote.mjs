import CommandQuery from "./CommandQuery.mjs";

class CommandQueryMoveVote extends CommandQuery {
	constructor(bot) {
		super(bot, '투표이동', ['VoteId']);
	}

	async doExecute({VoteId}, callback_query) {
		const chat = this.bot.getChat(callback_query.message.chat.id);
		const vote = chat.votes.find(v => v.voteId === VoteId);
		if(!vote) return;

		await this.bot.fetch('sendMessage', {
			text: `투표 #${vote.voteId}`,
			reply_to_message_id: vote.message,
			reply_markup: {
				inline_keyboard: [
					[{
						text: '투표 메시지 생성',
						callback_data: `투표새로고침:${vote.voteId}`
					}]
				]
			}
		});
	}
}

export default CommandQueryMoveVote;
