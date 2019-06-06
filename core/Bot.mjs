import axios from "axios";
import commands from "../commands/index.mjs"
import fs from "fs";
import path from "path";
import packageInfo from "../package.json";
import timers from "../timers/index.mjs";
import types from "../types/index.mjs";
import util from "util";

import Chat from "./Chat.mjs";

class Bot {
	constructor(config) {
		this.chats = {};
		this.types = types;
		this.commands = commands(this);
		this.timers = timers(this);
		this.basePath = path.resolve('.', 'data');
		this.config = config;

		this.axios = axios.create({
			baseURL: `https://api.telegram.org/bot${config.token}/`,
			headers: {
				'User-Agent': `Sibyl ${packageInfo.version}`,
				'Content-Type': 'application/json'
			}
		});

		setInterval(() => this.timerTick(), 100);
	}

	async loadBot() {
		const chats = await util.promisify(fs.readdir)(path.resolve(this.basePath, 'chats'));

		for(let v of chats) {
			if(!v.endsWith('.json')) continue

			const chatId = parseInt(v.slice(0, -5));
			this.chats[chatId] = await Chat.loadFrom(this, chatId);
		}
	}

	async fetch(target, options, throwError=false) {
		try {
			const {data} = await this.axios.post(target, JSON.stringify(options));
			return data ? data.result : '';
		} catch(e) {
			if(!throwError) {
				console.error(e);
				return;
			}

			throw e;
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

	timerTick() {
		const date = new Date;
		this.timers.forEach(v => v.update(date));
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
