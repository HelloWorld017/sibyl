import CommandQuery from "./CommandQuery.mjs";

class CommandQuerySimpleVote{
	constructor(bot) {
		super(bot, "간단투표참가", ['SimvoteId', 'OptionId']);
	}

	async doExecute({OptionId, SimvoteId}, callback_query) {
		const queryId = callback_query.id;
		const chat = this.bot.getChat(message.chat.id);
		if(!chat.config.simvote) chat.config.simvote = [];

		const vote = chat.config.simvote.find(vote => vote.id === SimvoteId);
		const text = callback_query.message.text;

		if(!text || !vote) {
			await this.bot.fetch('answerCallbackQuery', {
				callback_query_id: queryId,
				text: '너무 오래된 메시지입니다!'
			});
			return;
		}

		const username = callback_query.from.username;

		if(!username) {
			await this.bot.fetch('answerCallbackQuery', {
				callback_query_id: queryId,
				text: '유저명이 없습니다!'
			});
		}

		const votedOpt = vote.options.find(v => v.voters.includes(username));
		if(votedOpt) {
			votedOpt.voters = votedOpt.voters.filter(v => v !== username);
		}

		const votingOpt = vote.options[OptionId];
		if(!votingOpt) {
			await this.bot.fetch('answerCallbackQuery', {
				callback_query_id: queryId,
				text: '투표하려는 옵션이 사라졌습니다!'
			});
			return;
		}
		votingOpt.voters.push(username);

		await this.bot.fetch('editMessageText', {
			chat_id: callback_query.message.chat.id,
			message_id: callback_query.message.message_id,
			text,
			reply_markup: {
				inline_keyboard: [
					[
						vote.options.map((option, index) => {
							text: `${option.emoji} (${option.voters.length}명)`,
							callback_data: `간단투표참가:${voteId}:${index}`
						}),

						...(vote.anonymity ? [] : [[{
							text: '투표한 사람 출력',
							callback_data: '간단투표인원:'
						}]])
					]
				]
			}
		});

		await this.bot.fetch('answerCallbackQuery', {
			callback_query_id: queryId,
			text: '성공적으로 투표했습니다!'
		});
	}
}

export default CommandQuerySimpleVote;
