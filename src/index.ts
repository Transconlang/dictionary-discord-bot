import 'dotenv/config';
import {
	ActivityType,
	Colors,
	EmbedBuilder,
	Events,
	OAuth2Scopes,
	PresenceUpdateStatus,
	TimestampStyles,
	codeBlock,
	time
} from 'discord.js';
import { argv, stdout } from 'process';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { readdir, rm } from 'fs/promises';
import { Jsoning, JSONValue } from 'jsoning';
import { DevIds, permissionsBits, PORT } from './config';
import { Command, CommandClient, createServer, logger, Methods } from './lib';
import { scheduleJob } from 'node-schedule';
import { refreshCachedLangSpec } from '@/lib/kumilinwa/refreshCache';

const Dirname = dirname(fileURLToPath(import.meta.url));

argv.shift();
argv.shift();
if (argv.includes('-d')) {
	logger.level = 'debug';
	logger.debug('Debug mode enabled.');
}

const StatsDB = new Jsoning('stats.tmp.db.json');
logger.debug('Created stats database.');

const client = new CommandClient({
	intents: [],
	presence: {
		activities: [
			{
				name: 'Kumilinwa',
				type: ActivityType.Listening
			}
		],
		afk: false,
		status: PresenceUpdateStatus.Online
	}
});
logger.debug('Created client instance.');

const server = createServer(
	{
		handler: (_req, res) =>
			res.redirect(
				client.generateInvite({
					permissions: permissionsBits,
					scopes: [OAuth2Scopes.Bot]
				})
			),
		method: Methods.GET,
		route: '/invite'
	},
	{
		handler: (_req, res) => res.redirect('/status'),
		method: Methods.GET,
		route: '/'
	},
	{
		handler: (_req, res) => res.sendStatus(client.isReady() ? 200 : 503),
		method: Methods.GET,
		route: '/status'
	},
	{
		handler: (req, res) => {
			if (
				req.headers['content-type'] !== 'application/json' &&
				req.headers['content-type'] != undefined
			)
				res.status(415).end();
			else if (client.isReady())
				res
					.status(200)
					.contentType('application/json')
					.send({
						clientPing: client.ws.ping,
						clientReady: client.isReady(),
						commandCount: client.application!.commands.cache.size,
						guildCount: client.application!.approximateGuildCount,
						lastReady: client.readyAt.valueOf(),
						uptime: client.uptime
					})
					.end();
			else res.status(503).end();
		},
		method: Methods.GET,
		route: '/info'
	},
	{
		handler: (req, res) => {
			if (
				req.headers['content-type'] !== 'application/json' &&
				req.headers['content-type'] != undefined
			)
				res.status(415).end();
			else if (client.isReady())
				res
					.status(200)
					.contentType('application/json')
					.send({
						commands: client.commands.map(command => ({
							data: command.data.toJSON(),
							help: command.help?.toJSON()
						})),
						timestamp: Date.now()
					})
					.end();
			else res.status(503).end();
		},
		method: Methods.GET,
		route: '/commands'
	}
);
logger.debug('Created server instance.');

const commandsPath = join(Dirname, 'commands');
const commandFiles = (await readdir(commandsPath)).filter(file =>
	file.endsWith('.ts')
);
logger.debug('Loaded command files.');
const cmndb = new Jsoning('cmnds.tmp.db.json');
for (const file of commandFiles) {
	const filePath = join(commandsPath, file);
	logger.debug(`Loading command ${filePath}`);
	const command: Command = await import(filePath);
	client.commands.set(command.data.name, command);
	if (command.help)
		await cmndb.set(
			command.data.name,
			command.help.toJSON() as unknown as JSONValue
		);
}
client.commands.freeze();
logger.info('Loaded commands.');

/**
	const eventsPath = join(Dirname, 'events');
	const eventFiles = readdirSync(eventsPath).filter(file => file.endsWith('.ts'));
	for (const file of eventFiles) {
		const filePath = join(eventsPath, file);
		const event: Event = await import(filePath);
		if (event.once)
			client.once(event.name, async (...args) => await event.execute(...args));
		else client.on(event.name, async (...args) => await event.execute(...args));
	}
	logger.debug('Loaded events.');
*/

client
	.on(Events.ClientReady, () => logger.info('Client#ready'))
	.on(Events.InteractionCreate, async interaction => {
		if (interaction.user.bot) return;
		if (interaction.isChatInputCommand()) {
			const command = client.commands.get(interaction.commandName);
			if (!command) {
				await interaction.reply('Internal error: Command not found');
				return;
			}
			try {
				await command.execute(interaction);
			} catch (e) {
				logger.error(e);
				if (interaction.replied || interaction.deferred) {
					await interaction.editReply(
						'There was an error while running this command.'
					);
				} else {
					await interaction.reply({
						content: 'There was an error while running this command.',
						ephemeral: true
					});
				}
			}
		}
	})
	.on(Events.Debug, m => logger.debug(m))
	.on(Events.Error, m => {
		logger.error(m);
		sendError(m);
	})
	.on(Events.Warn, m => logger.warn(m));
logger.debug('Set up client events.');

await refreshCachedLangSpec();
await StatsDB.set('langSpecCacheAge', Date.now());
logger.debug('Cached language specification.');

await client
	.login(process.env.DISCORD_TOKEN)
	.then(() => logger.info('Logged in.'));

process.on('SIGINT', async () => {
	sendError(new Error('SIGINT received.'));
	await client.destroy();
	stdout.write('\n');
	logger.info('Destroyed Client.');
	await rm(join(Dirname, '..', 'stats.tmp.db.json'));
	await rm(join(Dirname, '..', 'cmnds.tmp.db.json'));
	logger.info('Removed temporary databases.');
	logger.info('Cleaned up, exiting.');
	process.exit(0);
});

server.listen(process.env.PORT ?? PORT);
logger.info(`Listening to HTTP server on port ${process.env.PORT ?? PORT}.`);

process.on('uncaughtException', sendError);
process.on('unhandledRejection', sendError);
logger.debug('Set up error handling.');

// refresh cached language specification every 5 minutes
scheduleJob('*/5 * * * *', refreshCachedLangSpec);

logger.info('Process setup complete.');

async function sendError(e: Error) {
	const date = new Date();
	for (const devId of DevIds)
		client.users.fetch(devId).then(user => {
			user.send({
				embeds: [
					new EmbedBuilder()
						.setTitle('Error Log')
						.setDescription(e.message)
						.addFields({ name: 'Stack Trace', value: codeBlock(e.stack ?? '') })
						.addFields({
							name: 'ISO 8601 Timestamp',
							value: date.toISOString()
						})
						.addFields({
							name: 'Localized DateTime',
							value: time(date, TimestampStyles.LongDateTime)
						})
						.setColor(Colors.Red)
						.setTimestamp()
				]
			});
		});
}
