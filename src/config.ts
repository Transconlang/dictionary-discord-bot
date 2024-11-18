import { PermissionFlagsBits, PermissionsBitField } from 'discord.js';

export const clientId = '1307953747741245460';

export const DevIds = ['817214551740776479'];

export const permissionsBits = new PermissionsBitField().add(
	PermissionFlagsBits.AddReactions,
	PermissionFlagsBits.EmbedLinks,
	PermissionFlagsBits.ReadMessageHistory,
	PermissionFlagsBits.SendMessages,
	PermissionFlagsBits.SendMessagesInThreads,
	PermissionFlagsBits.ViewChannel
).bitfield;

export const PORT = 8000;

// ! change branch to main later
export const LangSpecURL =
	'https://raw.githubusercontent.com/Transconlang/translang/refs/heads/main/rawspec/0-complete.json';
