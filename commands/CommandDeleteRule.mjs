import Command from "./Command";

class CommandDeleteRule extends Command {
	constructor(bot) {
		super(bot, "규칙삭제", [
			'RuleId'
		]);
	}

	async doExecute({RuleId}, message) {
		const chat = this.bot.getChat(message.chat.id);

		const rule = chat.rules.find(v => v.ruleId === RuleId);

		if(!rule) {
			await this.bot.sendHtml(`해당하는 규칙이 없습니다.`, chat.id);
			return;
		}

		await chat.createVote(rule, true);
	}

	getDescription() {
		return '새 규칙삭제 투표를 합니다.';
	}

	getArgsDescription() {
		return {
			RuleId: '삭제할 규칙의 ID'
		};
	}
}

export default CommandDeleteRule;
