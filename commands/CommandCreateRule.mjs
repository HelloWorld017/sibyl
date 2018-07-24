import Command from "./Command";

class CommandCreateRule extends Command {
	constructor(bot) {
		super(bot, "규칙생성", [
			'Condition',
			'Penalty'
		]);
	}

	async doExecute({MessageType, Description, Coefficient, Action}, message) {
		const chat = bot.chats[message.chat.id];
		const hasVote = chat.findVote(MessageType, Description);
		if(hasVote) {
			await bot.sendHtml(`이미 관련 투표가 진행중입니다! 먼저 끝난 후에 다시 투표를 만들어주세요.`, chat.id);
			return;
		}

		await chat.createVote(new Rule(
			MessageType,
			Description,
			Coefficient,
			Action
		), false);
	}

	getDescription() {
		return '새 규칙생성 투표를 합니다.';
	}

	getArgsDescription() {
		return {
			MessageType: '스티커팩, 스티커, 문자열 중 하나',
			Description: '스티커팩나 스티커일 경우 ID, 문자열일 경우 포함된 문자 (!정보를 통해 확인할 수 있습니다.)',
			Coefficient: '증가할 범죄계수',
			Action: '메시지에 대한 처분 사항'
		};
	}
}

export default CommandCreateRule;
