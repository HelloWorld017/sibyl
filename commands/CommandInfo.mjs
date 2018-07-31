import Command from "./Command";

class CommandInfo extends Command {
	constructor(bot) {
		super(bot, "정보", []);
	}

	async doExecute(_, message) {
		if(!message.reply_to_message || !message.reply_to_message.sticker) {
			await this.bot.sendHtml("스티커의 답장으로 사용해주세요.", message.chat.id);
			return;
		}

		const sticker = message.reply_to_message.sticker;

		let infoMessage = `메세지 정보\n\n`;

		infoMessage += `<i>\u{1F4D3}스티커팩</i>: <code>${sticker.set_name}</code>\n`;
		infoMessage += `<i>\u{1F320}스티커</i>: <code>${sticker.file_id}</code>`;

		await this.bot.sendHtml(infoMessage, message.chat.id);
	}

	getDescription() {
		return '스티커 정보를 불러옵니다.';
	}

	getArgsDescription() {
		return {};
	}
}

export default CommandInfo;
