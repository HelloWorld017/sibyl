import Command from "./Command.mjs";

class CommandGather extends Command {
	constructor(bot) {
		super(bot, "파티", ['People', 'Content']);
	}

	async doExecute({People}, message, rawQuery) {
		const chat = this.bot.getChat(message.chat.id);
		const querySplit = rawQuery.split(' ');
		querySplit.shift();

		const content = querySplit.join(' ');

		if(People > 99999) {
			People = 99999;
		}
		await this.bot.sendHtml(
			'파티원 모집중 (0/' + People + ')\n\n' +
				content + '\n\n' +
				'파티원:',
			message.chat.id,
			{
				reply_markup: {
					inline_keyboard: [
						[{
							text: '파티참가',
							callback_data: '파티참가:'
						}]
					]
				}
			}
		);
	}

	getDescription() {
		return '파티원을 모읍니다.';
	}

	getArgsDescription() {
		return {
			Content: '파티 목적'
		};
	}

	get strictLen() {
		return false;
	}
}

export default CommandGather;
