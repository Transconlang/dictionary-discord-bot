import {
	ChatInputCommandInteraction,
	EmbedBuilder,
	SlashCommandBuilder
} from 'discord.js';
import Jsoning from 'jsoning';
import { Duration } from 'luxon';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

export const data = new SlashCommandBuilder()
	.setName('status')
	.setDescription('Get bot status')
	.addBooleanOption(option =>
		option
			.setName('ephemeral')
			.setDescription('Set the response to ephemeral')
			.setRequired(false)
	);

export async function execute(interaction: ChatInputCommandInteraction) {
	const ephemeral = interaction.options.getBoolean('ephemeral') ?? false;
	await interaction.reply({
		ephemeral,
		embeds: [
			new EmbedBuilder().setTitle('Bot Status').setFields(
				{
					name: 'Uptime',
					value: Duration.fromMillis(interaction.client.uptime).toHuman({
						listStyle: 'long'
					})
				},
				{
					name: 'Latency (ms)',
					value: interaction.client.ws.ping.toString()
				},
				{
					name: 'Language Specification Cache Age',
					value: Duration.fromMillis(
						Date.now() -
							parseInt(
								(await new Jsoning(
									join(
										dirname(fileURLToPath(import.meta.url)),
										'stats.tmp.db.json'
									)
								).get('langSpecCacheAge'))!
							)
					).toHuman({
						listStyle: 'long'
					})
				}
			)
		]
	});
}
