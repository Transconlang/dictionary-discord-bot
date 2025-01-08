import {
	formatResourceType,
	ResourceType,
	SourcesList
} from '@/lib/quicklinks';
import {
	ChatInputCommandInteraction,
	EmbedBuilder,
	InteractionContextType,
	SlashCommandBuilder
} from 'discord.js';

export const data = new SlashCommandBuilder()
	.setName('quicklinks')
	.setDescription('Fetch links to helpful language sources')
	.setContexts(
		InteractionContextType.BotDM,
		InteractionContextType.Guild,
		InteractionContextType.PrivateChannel
	)
	.addStringOption(opt =>
		opt
			.setName('type')
			.setDescription('The type of resources to fetch')
			.setChoices(
				Object.entries(ResourceType).map(([name, value]) => ({ name, value }))
			)
			.setRequired(false)
	)
	.addBooleanOption(opt =>
		opt
			.setName('ephemeral')
			.setDescription('Whether to send an ephemeral response')
			.setRequired(false)
	);

export async function execute(interaction: ChatInputCommandInteraction) {
	const typeopt = interaction.options.getString('type', false);
	const resources = typeopt
		? SourcesList.filter(resource => resource.type === typeopt)
		: SourcesList;
	await interaction.reply({
		ephemeral: interaction.options.getBoolean('ephemeral', false) ?? false,
		embeds: [
			new EmbedBuilder()
				.setTitle('Quick Links')
				.setDescription(
					resources
						.map(
							({ name, url, type }) =>
								`[${name}](${url}) – ${formatResourceType(type)}`
						)
						.join('\n') || 'No such resources found D:'
				)
		]
	});
}
