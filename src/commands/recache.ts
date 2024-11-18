import { refreshCachedLangSpec } from '@/lib/kumilinwa/refreshCache';
import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';

export const data = new SlashCommandBuilder()
	.setName('recache')
	.setDescription('Refresh the cached language specification');

export async function execute(interaction: ChatInputCommandInteraction) {
	await interaction.deferReply();
	await refreshCachedLangSpec();
	await interaction.editReply('Refreshed the language specification cache!');
}
