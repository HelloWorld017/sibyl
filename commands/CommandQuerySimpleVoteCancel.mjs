import CommandQuery from "./CommandQuery.mjs";
import CommandSimpleVote from "./CommandSimpleVote.mjs";

class CommandQuerySimpleVoteCancel extends CommandQuery {
	constructor(bot) {
		super(bot, "간단투표취소", ['SimvoteId']);
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

		const username = callback_query.from.username;

		if(!username) {
			await this.bot.fetch('answerCallbackQuery', {
				callback_query_id: queryId,
				text: '유저명이 없습니다!'
			});
		}

		vote.options.forEach(option => {
			option.voters = option.voters.filter(v => v !== username);
		});

		await chat.save();

		await this.bot.fetch('editMessageText', {
			chat_id: callback_query.message.chat.id,
			message_id: callback_query.message.message_id,
			text,
			reply_markup: CommandSimpleVote.getKeyboard(SimvoteId, vote.options, vote.anonymity)
		});

		await this.bot.fetch('answerCallbackQuery', {
			callback_query_id: queryId,
			text: '성공적으로 취소했습니다.'
		});
	}
}

export default CommandQuerySimpleVoteCancel;
