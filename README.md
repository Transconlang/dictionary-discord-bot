# dictionary-discord-bot

The official dictionary Discord bot for Kumilinwa, the trans constructed language! :3

## How's it work?

The bot is a simple Discord bot that uses the [Discord.js](https://discord.js.org) library to interact with the [Discord API](https://discord.dev). It uses slash commands to interact with the user.

The language specification is cached in a JSON file and refreshed hourly to prevent a stale cache. The search looks through the specification and returns matches.
