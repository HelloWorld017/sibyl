import calcium from "calcium";
import util from "util";

const getMeal = util.promisify(calcium.get);

class TimerMeal {
	constructor(bot) {
		super("Meal", bot);
		this.called = 0;
	}

	update(date) {
		if(Date.now() - this.called < 61 * 60 * 1000) return; // Add additional 1 minute

		if(date.getDay() === 6 || date.getDay() === 0) return;
		switch(date.getHours()) {
			case 10:
				this.getMeal(date, 'lunch', '점심');
				break;

			case 16:
				this.getMeal(date, 'dinner', '저녁');
				break;
		}
	}

	getMeal(date, type, typeName) {
		this.called = Date.now();
		
		for (let chat of this.bot.chats) {
			let meal;
			try {
				if(chat.config.school) {
					meal = await getMeal(chat.config.school, date);
					if(meal === null) continue;
				}
			} catch(e) {
				continue;
			}

			const mealText = meal[date.getDate()][type].join('\n');
			await this.bot.sendHtml(
				`${date.getMonth() + 1}월 ${date.getDate()}일 ${typeName}\n\n` + mealText,
				chat.id
			);
		}
	}
}

export default TimerMeal;
