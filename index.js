import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { Client as DiscordClient, Collection, GatewayIntentBits } from 'discord.js';
import { Client as ExarotonClient } from 'exaroton';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const { deployCommands } = await import(path.join(__dirname, 'common_resources', 'deploy_commands.js'));
await deployCommands()

const BOT_TOKEN = process.env['bot_token'];
const EXAROTON_TOKEN = process.env['exaroton_token'];
const SERVER_ID = process.env['server_id'];

const discordClient = new DiscordClient({ intents: [
  GatewayIntentBits.Guilds,
  GatewayIntentBits.GuildMessages,
  GatewayIntentBits.MessageContent] });
const exarotonClient = new ExarotonClient (EXAROTON_TOKEN);
const server = exarotonClient.server(SERVER_ID);

const chatBridges = {};

discordClient.commands = new Collection();
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const { default : command } = await import(filePath);
		if ('data' in command && 'execute' in command) {
			discordClient.commands.set(command.data.name, command);
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const { default : event } = await import(filePath);
	if (event.once) {
		discordClient.once(event.name, (...args) => event.execute(...args, server));
	} else {
		discordClient.on(event.name, (...args) => event.execute(...args, server, chatBridges));
	}
}

discordClient.login(BOT_TOKEN);