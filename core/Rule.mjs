class Rule {
	constructor(ruleId, chat, messageType, description, coefficient, action) {
		this.ruleId = ruleId;
		this.chat = chat;
		this.messageType = messageType;
		this.description = description;
		this.coefficient = coefficient;
		this.action = action;
	}

	test(message) {
		if(message.chat.id !== this.chatId) return;

		switch(this.messageType) {
			case '스티커':
				if(!message.sticker) return false;
				return message.sticker.file_id === this.description;

			case '스티커팩':
				if(!message.sticker) return false;
				return message.sticker.set_name === this.description;

			case '문자열':
				if(!message.text) return false;
				return message.text.includes(this.description);

			default:
				return false;
		}
	}

	makeRule() {
		this.ruleId = this.chat.rules.length;
		this.chat.addRule(this);
	}

	removeRule() {
		this.chat.rules.splice(this.chat.rules.indexOf(this), 1);
	}
}

export default Rule;
