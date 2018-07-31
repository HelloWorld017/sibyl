import Command from "./Command";

class CommandGetRule extends Command {
	constructor(bot) {
		super(bot, "규칙", []);
	}

	async doExecute({MessageType, RuleId}, message) {
		const chat = this.bot.getChat(message.chat.id);
		const rules = chat.rules.map(v => `<i>#${v.ruleId}</i>\n ${v.readableContent}\n\n`).join('');

		await this.bot.sendHtml(`규칙목록\n\n ${rules}`, chat.id);
	}

	getDescription() {
		return '규칙의 목록을 불러옵니다.';
	}

	getArgsDescription() {
		return {};
	}
}

export default CommandGetRule;
