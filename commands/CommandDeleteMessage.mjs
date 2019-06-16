import Command from "./Command.mjs";

class CommandDeleteMessage extends Command {
	constructor(bot) {
		super(bot, "삭제", []);
	}

	async doExecute(_, message) {
		if(!message.reply_to_message) {
			await this.bot.sendHtml("삭제하고자 하는 메세지의 답장으로 사용해주세요.", message.chat.id);
			return;
		}

		await this.bot.fetch('deleteMessage', {
			chat_id: message.chat.id,
			message_id: message.reply_to_message.message_id
		});

		await this.bot.fetch('deleteMessage', {
			chat_id: message.chat.id,
			message_id: message.message_id
		});
	}

	getDescription() {
		return '지우고자 하는 메시지를 지웁니다';
	}


	getArgsDescription() {
		return {};
	}

	get aliases() {
		return ['-', 'x', '에휴', '죽어', '제발']
	}
}

export default CommandDeleteMessage;
