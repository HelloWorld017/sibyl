import CommandQuery from "./CommandQuery.mjs";

class CommandQuerySimpleVoters extends CommandQuery {
	constructor(bot) {
		super(bot, "간단투표인원", ['SimvoteId']);
	}

	async doExecute({SimvoteId}, callback_query) {
		const queryId = callback_query.id;
		const chat = this.bot.getChat(callback_query.message.chat.id);
		if(!chat.config.simvote) chat.config.simvote = [];

		const vote = chat.config.simvote.find(vote => vote.id === SimvoteId);
		const text = callback_query.message.text;

		if(!text || !vote) {
			await this.bot.fetch('answerCallbackQuery', {
				callback_query_id: queryId,
				text: '너무 오래된 메시지입니다!'
			});
			return;
		}

		if(vote.anonymity) {
			await this.bot.fetch('answerCallbackQuery', {
				callback_query_id: queryId,
				text: '익명 투표입니다!'
			});
			return;
		}

		let textify = users => users
			.map(v => {
				const chatUser = Object.values(chat.users).find(user => user.username === v);
				return [
					v,
					(
						chatUser ?
						`${chatUser.last_name ? `${chatUser.last_name} ` : ''}${chatUser.first_name}` :
						`@${v}`
					)
					.replace(/</g, '&gt;')
					.replace(/>/g, '&lt;')
				];
			})
			.sort(([v1, u1], [v2, u2]) => u1.localeCompare(u2))
			.map(([v, username]) => `<a href="https://t.me/${encodeURIComponent(v)}">${username}</a>`)
			.join(', ');

		const total = [...new Set(vote.options.flatMap(v => v.voters))];

		const send = async (parseMode='HTML') => {
			const message =
				`#투표_${SimvoteId} 참가인원 (${total.length})\n` +
				`${textify(total)}\n\n` +
				vote.options.map(v => `${v.emoji}(${v.voters.length}명) ${textify(v.voters)}`).join('\n');

			await this.bot.fetch(
				'sendMessage',
				{
					text: message,
					chat_id: callback_query.message.chat.id,
					disable_web_page_preview: true,
					...(parseMode ? {parse_mode: parseMode} : {})
				},
				true
			);
		};

		try {
			await send();
		} catch(e) {
			console.log(e);
			textify = users => users.sort().join(', ');
			try {
				await send(null);
			} catch(e) {
				await this.bot.fetch('answerCallbackQuery', {
					callback_query_id: queryId,
					text: '보내기에 실패했습니다 T_T'
				});
				return;
			}
		}

		await this.bot.fetch('answerCallbackQuery', {
			callback_query_id: queryId
		});
	}
}

export default CommandQuerySimpleVoters;
