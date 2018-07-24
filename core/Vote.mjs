class Vote {
	constructor(rule, chat, voteId, isDeleteVote) {
		this.rule = rule;
		this.chatId = chat.id;
		this.voteId = voteId;
		this.bot = chat.bot;
		this.administrators = null;
		this.needed = 0;
		this.voteStatus = [];
		this.isDeleteVote = isDeleteVote;
		this.tempRuleAdded = false;

		this.startDate = Date.now();
		this.endDate = Date.now() + 60 * 60 * 1000;
	}

	async init() {
		this.administrators = await this.chat.getAdministrators();
		this.needed = Math.ceil(this.administrators.length / 2);
		if(!this.isDeleteVote)
			this.tempRuleAdded = this.chat.addTempRule(this.rule);

		setTimeout(() => this.finishVote(), 60 * 60 * 1000);

		this.message = await this.createVoteMessage();
	}

	async vote(query) {
		if(this.finished) return;
		if(!this.administrators) return;
		if(!query.data || !query.from) return;

		const chatMember = this.administrators.find(v => v.user.id === query.from.id);
		const isVoted = this.voteStatus.findIndex(v => v.userId === query.from.id);

		let changed = false;
		if(isVoted >= 0) {
			changed = true;
			this.voteStatus.splice(isVoted, 1);
		}

		const result = query.data.split(':')[1] === 'true';
		const readableResult = result ? '찬성' : '반대';
		this.voteStatus.push({
			userId: query.from.id,
			result
		});

		await this.bot.fetch('answerCallbackQuery', {
			callback_query_id: query.id,
			text: changed ? `${readableResult}(으)로 의견을 바꾸셨습니다.` : `${readableResult}에 투표하셨습니다.`
		});

		this.updateVoteMessage();
	}

	async createVoteMessage() {
		const message = await this.bot.sendHtml(this.getVoteDescriptor());
		return message.message_id;
	}

	async updateVoteMessage() {
		const descriptor = this.getVoteDescriptor();
		descriptor.chat_id = this.chatId;
		descriptor.message_id = this.message;

		await this.bot.fetch('editMessageText', descriptor);
	}

	getVoteDescriptor() {
		const left = Math.max(0, this.needed - this.voteStatus.length);
		const graph = '\u2705'.repeat(Math.round(this.agree / this.voteStatus.length * 10)) +
			'\u{1F6D1}'.repeat(Math.round(this.disagree / this.voteStatus.length * 10));

		const text = `투표 #${this.voteId}<br><br>` +
			`안건: ${this.getReadableContent()}<br><br>` +
			`종료 시간: ${this.getReadableEnd()}<br><br>` +
			`투표 현황: 찬성 ${this.agree}, 반대 ${this.disagree}, 남은 필요 참가 인원 ${left}<br>` +
			`\u{1F44D} ${graph} \u{1F44E}<br><br>`;

		if(this.finished) {
			text += '가결되었습니다.';

		} else {
			text += `이 방의 관리자 ${this.needed}명 이상이 참가하여, 이 중 과반수의 득표를 얻을 시 가결됩니다.<br>`;

			if(this.tempRuleAdded) {
				text += `또한, 1시간 동안 범죄계수 증가 없이 가처분이 시행됩니다.`;
			}
		}

		return {
			text,
			parse_mode: 'HTML',
			reply_markup: JSON.stringify([
				[
					{
						text: '찬성',
						callback_data: 'true'
					},

					{
						text: '반대',
						callback_data: 'false'
					}
				]
			])
		};
	}

	getReadableEnd() {
		return new Date(this.endDate).toLocaleString('ko-KR', {timeZone: 'Asia/Seoul'});
	}

	getReadableContent() {
		let content = `${this.rule.messageType} <code>${this.rule.description}</code>의 메시지가 발견될 시,<br>` +
		`<code>${this.rule.coefficient}</code>만큼의 범죄계수 증가 및 <code>${this.rule.action}</code> 조치`;

		if(this.isDeleteVote) {
			content = '<i>삭제:</i> ' + content;
		}

		return content;
	}

	finishVote() {
		if(this.isPassable) {
			if(this.isDeleteVote)
				this.rule.makeRule();

			else this.rule.removeRule();
		}
		
		this.chat.removeVote(this);
	}

	get finished() {
		return this.endDate < Date.now();
	}

	get agree() {
		return this.voteStatus.filter(v => v.result).length;
	}

	get disagree() {
		return this.voteStatus.length - this.agree;
	}

	get isPassable() {
		return this.voteStatus.length >= this.needed && this.agree >= this.disagree;
	}
}

export default Vote;
