import { MatchType, searchLangSpec } from '@/lib';
import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';

export const data = new SlashCommandBuilder()
	.setName('search')
	.setDescription('Search for an entry in the dictionary')
	.addStringOption(option =>
		option.setName('query').setDescription('The search query').setRequired(true)
	)
	.addStringOption(option =>
		option
			.setName('match')
			.setDescription('The type of match to use (default: any)')
			.setRequired(false)
			.setChoices(
				{ name: 'Word', value: 'word' },
				{ name: 'Meaning', value: 'meaning' }
			)
	)
	.addBooleanOption(option =>
		option
			.setName('ephemeral')
			.setDescription('Whether to send an ephemeral response')
			.setRequired(false)
	);

export async function execute(interaction: ChatInputCommandInteraction) {
	await interaction.deferReply({
		ephemeral: interaction.options.getBoolean('ephemeral', false) ?? false
	});
	const query = interaction.options.getString('query', true),
		match = interaction.options.getString('match', false);
	const results = await searchLangSpec(
		query,
		(match as MatchType) ?? undefined
	);
	const response = results.length
		? results.map(({ word, meaning }) => `${word}: ${meaning}`).join('\n')
		: 'No results found.';
	await interaction.editReply(
		response.length > 2000
			? `Whoa, that's a lot of results! Discord's char limit is set to 2000 per message. Try narrowing down your search.\nYour search query: ${query}`
			: response
	);
}
