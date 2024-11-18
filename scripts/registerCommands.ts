import { REST, Routes } from 'discord.js';
import { dirname, join } from 'path';
import { clientId } from '../src/config';
import { fileURLToPath } from 'url';
import { readdir } from 'fs/promises';
import Jsoning, { JSONValue } from 'jsoning';
import { Command } from '../src/lib/struct/discord/types';

const Dirname = dirname(fileURLToPath(import.meta.url));

export const commandsPath = join(Dirname, '..', 'src', 'commands');

export async function registerCommands(
	token: string,
	commandFiles?: string[]
): Promise<{
	data: unknown;
	getCommands: () => Promise<unknown>;
	rest: REST;
}> {
	// eslint-disable-next-line no-param-reassign
	commandFiles =
		commandFiles ??
		(await readdir(commandsPath)).filter(file => file.endsWith('.ts'));
	const commands = [];
	for (const file of commandFiles)
		commands.push(
			((await import(join(commandsPath, file))) as Command).data.toJSON()
		);
	let data: unknown;
	const rest = new REST().setToken(token);
	await rest.put(Routes.applicationCommands(clientId), {
		body: commands
	});
	return {
		data,
		getCommands: async () =>
			await rest.get(Routes.applicationCommands(clientId)),
		rest
	};
}
