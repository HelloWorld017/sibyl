import axios from "axios";
import commands from "../commands"
import fs from "fs";
import path from "path";
import packageInfo from "../package.json";
import types from "../types";
import util from "util";

import Chat from "./Chat";

class Bot {
	constructor(token) {
		this.chats = {};
		this.types = types;
		this.commands = commands(this);
		this.basePath = path.resolve('.', 'data');

		axios.defaults.baseURL = `https://api.telegram.org/bot${token}/`;
		axios.defaults.headers.common['User-Agent'] = `Sibyl ${packageInfo.version}`;
		axios.defaults.headers.post['Content-Type'] = 'application/json';
	}

	async loadBot() {
		const chats = await util.promisify(fs.readdir)(path.resolve(this.basePath, 'chats'));

		for(let v of chats) {
			if(!v.endsWith('.json')) continue

			const chatId = parseInt(v.slice(0, -5));
			this.chats[chatId] = await Chat.loadFrom(this, chatId);
		}
	}

	async fetch(target, options) {
		try {
			const {data} = await axios.post(target, JSON.stringify(options));
			return data ? data.result : '';
		} catch(e) {
			console.error(e);
		}
	}

	async sendHtml(message, id, options={}) {
		const descriptor = {
			text: message,
			chat_id: id,
			parse_mode: 'HTML'
		};

		Object.keys(options).forEach(k => descriptor[k] = options[k]);

		await this.fetch('sendMessage', descriptor);
	}

	getChat(id) {
		if(this.chats[id]) return this.chats[id];
		this.chats[id] = new Chat(this, id);

		return this.chats[id];
	}

	async update(update) {
		const command = this.commands.find(command => command.isStatementCommand(update));
		if(command) {
			await command.execute(update);
		} else if(update.message) {
			const chat = this.getChat(update.message.chat.id);
			await chat.handle(update.message);
		}
	}
}

export default Bot;
