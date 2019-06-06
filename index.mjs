import bodyParser from "body-parser";
import express from "express";
import fs from "fs";
import path from "path";
import util from "util";

import Bot from "./core/Bot.mjs";

(async () => {
	const ensureExists = directory => util.promisify(fs.mkdir)(directory).catch(() => {});
	await ensureExists(path.resolve('.', 'data'));
	await ensureExists(path.resolve('.', 'data', 'chats'));

	let config;

	try {
		config = JSON.parse(await util.promisify(fs.readFile)(path.resolve('.', 'data', 'config.json'), 'utf8'));
	} catch(e) {
		console.error("설정파일을 열 수 없습니다. T_T");
		console.error(e);
		return;
	}

	const bot = new Bot(config);
	await bot.loadBot();

	await bot.fetch('setWebhook', {
		url: `${config.target}/${config.token}`
	});
	console.log("웹훅이 설정되었습니다. : " + `${config.target}/${config.token}`);

	const app = express();
	app.use(bodyParser.json({strict: false}));

	app.post(`/${config.token}`, async (req, res) => {
		await bot.update(req.body);
		res.status(200).send('Done :D - Sibyl');
	});

	app.use((req, res) => {
		res.redirect(301, 'https://t.me/bigdeokbot');
	});

	app.listen(config.port);
})();
