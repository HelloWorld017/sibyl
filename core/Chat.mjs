import fs from "fs";
import path from "path";
import util from "util";
import Rule from "./Rule.mjs";
import Vote from "./Vote.mjs";

class Chat {
	constructor(bot, chatId) {
		this.bot = bot;
		this.id = chatId;
		this.votes = [];
		this.rules = [];
		this.users = {};
		this.tempRules = [];
		this.noTemp = [];
		this.config = {};
		this.maxVoteId = 0;
		this.ruleFinder = target => rule =>
			(rule.messageType === target.messageType && rule.description === target.description);
	}

	async getAdministrators() {
		return (await this.bot.fetch('getChatAdministrators', {chat_id: this.id})).filter(v => !v.user.is_bot);
	}

	addRule(rule) {
		this.rules.push(rule);
	}

	async createVote(rule, isDeleteVote) {
		const vote = new Vote(rule, this, this.maxVoteId++, isDeleteVote);
		await vote.init();

		this.votes.push(vote);
		await this.save();
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

	async removeVote(vote) {
		this.votes.splice(this.votes.indexOf(vote), 1);
		if(vote.tempRuleAdded) {
			this.tempRules.splice(this.tempRules.indexOf(vote.rule), 1);
		}
		await this.save();
	}

	addTempRule(rule) {
		if(this.findRule(rule)) return false;

		this.tempRules.push(rule);
		this.noTemp.push(rule);
		return true;
	}

	async handle(message) {
		let deleteMsg = false;
		let ruleHandled = false;

		const handleRule = isTempRule => v => {
			if(v.test(message)) {
				if(!isTempRule) this.users[message.from.id].coefficient += v.coefficient;
				if(v.action === '삭제') deleteMsg = true;

				ruleHandled = true;
			}
		};

		if(!this.users[message.from.id]) {
			this.users[message.from.id] = {
				coefficient: 0,
				username: message.from.username,
				first_name: message.from.first_name,
				last_name: message.from.last_name
			};
			ruleHandled = true;
		}

		const user = this.users[message.from.id];
		['first_name', 'last_name', 'username'].forEach(k => {
			if(user[k] !== message.from[k]) {
				user[k] = message.from[k];
				ruleHandled = true;
			}
		});

		this.tempRules.forEach(handleRule(true));
		this.rules.forEach(v => {
			if(this.tempRules.some(this.ruleFinder(v))) {
				return;
			}

			handleRule(false)(v);
		});

		if(deleteMsg) {
			await this.bot.fetch('deleteMessage', {
				chat_id: this.id,
				message_id: message.message_id
			});
		}

		if(ruleHandled) {
			await this.save();
		}
	}

	async save() {
		const exportData = {
			votes: this.votes.map(v => v.exportData),
			rules: this.rules.map(v => v.exportData),
			tempRules: this.tempRules.map(v => v.exportData),
			noTemp: this.noTemp.map(v => v.exportData),
			maxVoteId: this.maxVoteId,
			users: this.users,
			id: this.id,
			config: this.config
		};

		const writeFile = util.promisify(fs.writeFile);
		await writeFile(
			path.resolve(this.bot.basePath, 'chats', `${this.id}.json`),
			JSON.stringify(exportData, null, '\t')
		);
	}

	static async loadFrom(bot, chatId) {
		const readFile = util.promisify(fs.readFile);
		const exportData = JSON.parse(
			await readFile(path.resolve(bot.basePath, 'chats', `${chatId}.json`), 'utf8')
		);

		const chat = new Chat(bot, chatId);
		chat.maxVoteId = exportData.maxVoteId;
		chat.rules = exportData.rules.map(v => Rule.importFrom(bot, v));
		chat.tempRules = exportData.tempRules.map(v => Rule.importFrom(bot, v));
		chat.noTemp = exportData.noTemp.map(v => Rule.importFrom(bot, v));
		chat.users = exportData.users;
		chat.config = exportData.config || {};

		for(let vote of exportData.votes) {
			chat.votes.push(await Vote.importFrom(bot, vote));
		}

		return chat;
	}
}

export default Chat;
