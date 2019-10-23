import CommandQuery from "./CommandQuery.mjs";

class CommandQuerySimpleVoters extends CommandQuery {
	constructor(bot) {
		super(bot, "간단투표인원", ['SimvoteId']);
	}

	async doExecute({SimvoteId}, callback_query) {
		const queryId = callback_query.id;
		const chat = this.bot.getChat(callback_query.message.chat.id);
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

		if(vote.anonymity) {
			await this.bot.fetch('answerCallbackQuery', {
				callback_query_id: queryId,
				text: '익명 투표입니다!'
			});
			return;
		}

		const total = [...new Set(vote.options.flatMap(v => v.voters))];

		await this.bot.sendHtml(
			`#투표_${SimvoteId} 참가인원 (${total.length})\n` +
			`${total.join(', ')}\n\n` +
			vote.options.map(v => `${v.emoji} ${v.voters.join(', ')}`).join('\n'),

			callback_query.message.chat.id
		);

		await this.bot.fetch('answerCallbackQuery', {
			callback_query_id: queryId
		});
	}
}

export default CommandQuerySimpleVoters;
