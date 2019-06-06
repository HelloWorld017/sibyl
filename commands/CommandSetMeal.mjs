import axios from "axios";
import calcium from "calcium";
import util from "util";

import Command from "./Command.mjs";

const findSchool = util.promisify(calcium.find);


class CommandSetMeal extends Command {
	constructor(bot) {
		super(bot, "급식", ['Location', 'School']);
	}

	async doExecute({Location, School}, message, rawQuery) {
		const chat = this.bot.getChat(message.chat.id);

		const reply = [];
		try {
			const location = await find(Location, School);
			location.forEach(v => {
				reply.push([{
					text: v.name,
					callback_data: `급식:${v.code}`
				}]);
			});
		} catch(e) {
			await this.bot.sendHtml('요청 중에 오류가 발생하였습니다: ' + e.message, chat.id);
			return;
		}

		await this.bot.fetch('sendMessage', {
			chat_id: message.chat.id,
			text: '해당하는 학교를 선택하여주세요!',
			parse_mode: 'HTML',
			reply_markup: {
				inline_keyboard: reply
			}
		});
	}

	getDescription() {
		return '급식 알림이를 받습니다.';
	}

	getArgsDescription() {
		return {
			Location: '시도명 (대전, 서울, 등)',
			School: '학교의 이름'
		};
	}
}

export default CommandSetMeal;
