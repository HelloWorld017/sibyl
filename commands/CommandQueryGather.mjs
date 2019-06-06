import CommandQuery from "./CommandQuery.mjs";

class CommandQueryGather extends CommandQuery {
	constructor(bot) {
		super(bot, "파티참가", []);
	}

	async doExecute(_, callback_query) {
		const text = callback_query.message.text;
		const queryId = callback_query.id;
		if(!text) {
			await this.bot.fetch('answerCallbackQuery', {
				callback_query_id: queryId,
				text: '너무 오래된 메시지입니다!'
			});
			return;
		}

		const partyNumberRegex = /^파티원 모집중 \(\d+\/(\d+)\)/;
		const partyListRegex = /파티원:([^]*)$/;

		const partyNumberRaw = text.match(partyNumberRegex);
		const partiesRaw = text.match(partyListRegex);
		if(!partiesRaw || !partyNumberRaw) {
			await this.bot.fetch('answerCallbackQuery', {
				callback_query_id: queryId,
				text: '잘못된 파티 메시지입니다!'
			});
			return;
		}

		const maxUser = parseInt(partyNumberRaw[1]);
		const username = callback_query.from.username;
		if(!username) {
			await this.bot.fetch('answerCallbackQuery', {
				callback_query_id: queryId,
				text: '유저명이 없습니다!'
			});
			return;
		}

		const partyList = partiesRaw[1].split(', ').map(v => v.trim()).filter(v => v.startsWith('@'));
		const newcomer = '@' + username;

		const newcomerIdx = partyList.indexOf(newcomer);
		if(newcomerIdx >= 0) {
			partyList.splice(newcomerIdx, 1);
			await this.bot.fetch('answerCallbackQuery', {
				callback_query_id: queryId,
				text: '파티에서 탈퇴되었습니다!'
			});
		} else {
			partyList.push(newcomer);
			if(partyList.length > maxUser) {
				await this.bot.fetch('answerCallbackQuery', {
					callback_query_id: queryId,
					text: '파티가 꽉 찼어요ㅠㅠ'
				});
				return;
			}

			await this.bot.fetch('answerCallbackQuery', {
				callback_query_id: queryId,
				text: '파티에 참여되었습니다!'
			});
		}

		let newText = text.replace(partyListRegex, '').replace(partyNumberRegex, '');
		newText = `파티원 모집중 (${partyList.length}/${maxUser})` + newText + '파티원: ' + partyList.join(',');

		await this.bot.fetch('editMessageText', {
			chat_id: callback_query.message.chat.id,
			message_id: callback_query.message.message_id,
			text: newText,
			reply_markup: JSON.stringify({
				inline_keyboard: [
					[{
						text: '파티 참가/탈퇴',
						callback_data: '파티참가:'
					}]
				]
			})
		});
	}

	get strictLen() {
		return false;
	}
}

export default CommandQueryGather;
