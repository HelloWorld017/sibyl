import axios from "axios";
import Command from "./Command";

class CommandGoogleImage extends Command {
	constructor(bot) {
		super(bot, "구글이미지", ['Query']);
	}

	async doExecute({}, message, rawQuery) {
		const searchResponse = await axios.get(`https://content.googleapis.com/customsearch/v1` +
			`?q=${encodeURIComponent(rawQuery)}` +
			`&cx=${encodeURIComponent(this.bot.config.google.cx)}` +
			`&key=${encodeURIComponent(this.bot.config.google.key)}` +
			`&safe=off&num=1&searchType=image`);

		const searchResult = searchResponse.data;

		if(!searchResult.queries || searchResult.items.length < 1) {
			await this.bot.sendHtml("해당하는 검색결과를 찾지 못했습니다 :(", message.chat.id);
			return;
		}

		const escapedQuery = rawQuery.replace('<', '&gt;').replace('>', '&lt;');
		const text = `<a href="${searchResult.items[0].link}">${escapedQuery}에 대한 이미지</a>`;

		try {
			await this.bot.fetch('sendPhoto', {
				chat_id: message.chat.id,
				photo: searchResult.items[0].link,
				caption: text,
				parse_mode: 'HTML'
			}, true);
		} catch(e) {
			try {
				await this.bot.fetch('sendPhoto', {
					chat_id: message.chat.id,
					photo: searchResult.items[0].image.thumbnailLink,
					caption: text,
					parse_mode: 'HTML'
				}, true);
			} catch(e2) {
				await this.bot.sendHtml(text, message.chat.id);
			}
		}
	}

	getDescription() {
		return '구글 이미지 검색을 합니다.';
	}

	getArgsDescription() {
		return {
			Query: '검색할 내용'
		};
	}

	get aliases() {
		return ['#'];
	}

	get strictLen() {
		return false;
	}
}

export default CommandGoogleImage;
