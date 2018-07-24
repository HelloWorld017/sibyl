class Chat {
	constructor(bot, chatId) {
		this.bot = bot;
		this.id = chatId;
		this.votes = [];
		this.rules = [];
		this.users = {};
		this.tempRules = [];
		this.noTemp = [];
		this.maxVoteId = 0;
		this.ruleFinder = target => rule =>
			(rule.messageType === target.messageType && rule.description === target.description);
	}

	async getAdministrators() {
		return await this.bot.fetch('getChatAdministrators', {chatId: this.id});
	}

	addRule(rule) {
		this.rules.push(rule);
		this.save();
	}

	async createVote(rule, isDeleteVote) {
		const vote = new Vote(rule, this, this.maxVoteId++, isDeleteVote);
		await vote.init();

		this.votes.push(vote);
	}

	findRule(target) {
		const finder = this.ruleFinder(target)
		const inRules = this.rules.find(finder);
		const inTempRules = this.tempRules.find(finder);
		const inNoTemps = this.noTemp.find(finder);

		return inRules || inTempRules || inNoTemps;
	}

	findVote(messageType, description) {
		const finder = this.ruleFinder({messageType, description});

		return this.votes.find(({rule}) => finder(rule));
	}

	removeVote(vote) {
		this.votes.splice(this.votes.indexOf(vote), 1);
		if(vote.tempRuleAdded) {
			this.tempRules.splice(this.tempRules.indexOf(vote.rule), 1);
		}
	}

	addTempRule(rule) {
		if(this.findRule(rule)) return false;

		this.tempRules.push(rule);
		this.noTemp.push(rule);
		return true;
	}

	async handle(message) {
		let deleteMsg = false;

		const handleRule = v => {
			if(v.test(message)) {
				if(!this.users[message.from.id])
					this.users[message.from.id] = {
						coefficient: 0;
					};

				this.users[message.from.id].coefficient += v.coefficient;
				if(v.action === '삭제') deleteMsg = true;
			}
		};

		this.tempRules.forEach(handleRule);
		this.rules.forEach(v => {
			if(this.tempRules.some(this.ruleFinder(v))) {
				return;
			}

			handleRule(v);
		});

		if(deleteMsg) {
			await this.bot.fetch('deleteMessage', {
				chat_id: this.id,
				message_id: message.message_id
			});
		}
	}

	save() {

	}

	static loadFrom(file) {

	}
}

export default Chat;
