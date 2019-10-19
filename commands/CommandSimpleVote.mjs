import emojiRegex from "emoji-regex";

import Command from "./Command.mjs";

class CommandSimpleVote extends Command {
	constructor(bot) {
		super(bot, "간단투표", ['Multivote', 'Anonymous', 'Content']);
		this.emojiRegex = emojiRegex();
	}

	async doExecute({Multivote, Anonymous}, message, rawQuery) {
		if(!Multivote || !Anonymous) {
			await this.sendHelpMessage(message.chat.id, '잘못된 사용법: \n\n');
			return;
		}

		const anonymity = Anonymous === '익명';


		const querySplit = rawQuery.split(' ');
		querySplit.shift();
		querySplit.shift();

		const content = querySplit.join(' ').trim();
		const lines = content.split('\n');

		const delimiter = lines.indexOf('');
		const voteContent = lines.slice(0, delimiter).join('');
		const voteOptions = lines.slice(delimiter + 1);

		if(!~delimiter || voteOptions.length <= 1) {
			await this.sendHelpMessage(message.chat.id, '잘못된 사용법: \n\n');
			return;
		}

		if(voteOptions.length > 10) {
			await this.bot.sendHtml('너무 선택지의 개수가 많습니다!', message.chat.id);
			return;
		}

		if(Multivote < 1) Multivote = 1;
		if(Multivote > voteOptions.length) Multivote = voteOptions.length;

		let voteIndex = 0;
		const voteOptionsParsed = voteOptions.map(v => {
			this.emojiRegex.lastIndex = 0;
			const emojiMatch = this.emojiRegex.exec(v);
			if(!emojiMatch) {
				voteIndex++;
				return {
					content: v,
					emoji: String.fromCodePoint(47 + voteIndex) + '\u{FE0F}\u{20E3}'
				};
			}

			if(emojiMatch.index === 0) {
				v = v.slice(emojiMatch[0].length);
			}

			return {
				content: v,
				emoji: emojiMatch[0]
			};
		});

		const voteOptionsText = voteOptionsParsed.map(option => `${option.emoji}: ${option.content}`);
		const voteId = Math.random().toString(36).slice(2, 8);

		const chat = this.bot.getChat(message.chat.id);
		if(!chat.config.simvote) chat.config.simvote = [];
		if(chat.config.simvote.length > 5) chat.config.simvote.shift();
		chat.config.simvote.push({
			id: voteId,
			anonymity,
			multivote: Multivote,
			options: voteOptionsParsed.map(v => ({
				emoji: v.emoji,
				voters: []
			}))
		});

		await chat.save();

		await this.bot.sendHtml(
			`\u{1F5F3} #투표_${voteId}\n` +
			`${voteContent}\n` +
			`(${anonymity ? '익명투표, ' : ''}최대 ${Multivote}개까지 투표 가능)\n\n` +
			'선택지:\n' +
			voteOptionsText.join('\n'),

			message.chat.id,

			{
				reply_markup: CommandSimpleVote.getKeyboard(voteId, voteOptionsParsed, anonymity)
			}
		);
	}

	getDescription() {
		return '원하는 내용으로 간단히 투표를 진행합니다.';
	}

	getArgsDescription() {
		return {
			Multivote: '최대 동시 투표 개수',
			Anonymous: '익명일 경우 익명, 아니면 공개',
			Content: '투표 내용을 적은 후 한 줄을 띄우고 한 줄에 하나씩 옵션을 입력'
		};
	}

	get strictLen() {
		return false;
	}

	static getKeyboard(voteId, options, anonymity) {
		let optionsKeyboard = options.map((option, index) => ({
			text: `${option.emoji} (${option.voters ? option.voters.length : 0}명)`,
			callback_data: `간단투표참가:${voteId}:${index}`
		}));

		optionsKeyboard = optionsKeyboard.reduce((prev, curr, index) => {
			if(index % 4 === 0) {
				prev.push([]);
			}

			prev[prev.length - 1].push(curr);
			return prev;
		}, []);

		return {
			inline_keyboard: [
				...optionsKeyboard,

				[
					{
						text: '투표 취소',
						callback_data: `간단투표취소:${voteId}`
					},

					...(anonymity ? [] : [{
						text: '투표한 사람 출력',
						callback_data: `간단투표인원:${voteId}`
					}])
				]
			]
		};
	}
}

export default CommandSimpleVote;
