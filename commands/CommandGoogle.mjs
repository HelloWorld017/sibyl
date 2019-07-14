import axios from "axios";
import Command from "./Command.mjs";

class CommandGoogle extends Command {
	constructor(bot) {
		super(bot, "구글", ['Query']);
	}

	async doExecute({}, message, rawQuery) {
		const searchResponse = await axios.get(`https://content.googleapis.com/customsearch/v1` +
			`?q=${encodeURIComponent(rawQuery)}` +
			`&cx=${encodeURIComponent(this.bot.config.google.cx)}` +
			`&key=${encodeURIComponent(this.bot.config.google.key)}` +
			`&safe=off&num=3`);

		const searchResult = searchResponse.data;

		if(!searchResult.queries) {
			await this.bot.sendHtml("해당하는 검색결과를 찾지 못했습니다 :(", message.chat.id);
			return;
		}

		const escapedQuery = rawQuery.replace(/</g, '&gt;').replace(/>/g, '&lt;');

		let result = `<a href="https://www.google.com/search?q=${encodeURIComponent(rawQuery)}">` +
			`${escapedQuery}` +
			`</a>에 대한 검색결과\n\n`;
		result += searchResult.items.map(v => `<a href="${v.link}">${v.title}</a>\n${v.snippet}`).join('\n\n');

		await this.bot.fetch('sendMessage', {
			chat_id: message.chat.id,
			text: result,
			parse_mode: 'HTML',
			disable_web_page_preview: true
		});
	}

	getDescription() {
		return '구글 검색을 합니다.';
	}

	getArgsDescription() {
		return {
			Query: '검색할 내용'
		};
	}

	get aliases() {
		return ['!'];
	}

	get strictLen() {
		return false;
	}
}

export default CommandGoogle;
