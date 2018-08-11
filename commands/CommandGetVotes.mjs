import Command from "./Command";

class CommandGetVotes extends Command {
	constructor(bot) {
		super(bot, "투표", []);
	}

	async doExecute(_, message) {
		const chat = this.bot.getChat(message.chat.id);
		const votes = chat.votes.map(v => `<i>#${v.voteId}</i>\n ${v.readableContent}\n\n`).join('');
		const reply = [[]];

		let j = 0;
		for(let i = 0; i < chat.votes.length; i++) {
			const vote = chat.votes[i];

			if(j >= 5) {
				reply.push([]);
			}

			reply[reply.length - 1].push({
				text: `#${vote.voteId}`,
				callback_data: `투표이동:${vote.voteId}`
			});

			j++;
		}

		await this.bot.sendHtml(`투표목록\n\n ${votes}`, chat.id, {
			reply_markup: {
				inline_keyboard: reply
			}
		});
	}

	getDescription() {
		return '투표의 목록을 불러옵니다.';
	}

	getArgsDescription() {
		return {};
	}

	get aliases() {
		return ['투표목록'];
	}
}

export default CommandGetVotes;
