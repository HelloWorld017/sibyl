import Command from "./Command";

class CommandGetRule extends Command {
	constructor(bot) {
		super(bot, "구글", []);
	}

	async doExecute({Query}, message) {
		const chat = this.bot.getChat(message.chat.id);
		const rules = chat.rules.map(v => `<i>#${v.ruleId}</i>\n ${v.readableContent}\n\n`).join('');

		await this.bot.sendHtml(`규칙목록\n\n ${rules}`, chat.id);
	}

	getDescription() {
		return '구글 검색을 합니다.';
	}

	getArgsDescription() {
		return {};
	}

	get aliases() {
		return ['!'];
	}
}

export default CommandGetRule;
