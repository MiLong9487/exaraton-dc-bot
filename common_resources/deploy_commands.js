import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { REST, Routes } from 'discord.js';

const BOT_TOKEN = process.env['bot_token'];
const BOT_CLIENT_ID = process.env['bot_client_id'];

const commands = [];
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const foldersPath = path.join(path.dirname(__dirname), 'commands');
const commandFolders = fs.readdirSync(foldersPath);

export const deployCommands = async () => {
  for (const folder of commandFolders) {
  	const commandsPath = path.join(foldersPath, folder);
  	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
  	for (const file of commandFiles) {
  		const filePath = path.join(commandsPath, file);
  		const { default : command } = await import(filePath);
  		if ('data' in command && 'execute' in command) {
  			commands.push(command.data.toJSON());
  		} else {
  			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
  		}
  	}
  }
  
  const rest = new REST().setToken(BOT_TOKEN);
  
  (async () => {
  	try {
  		console.log(`Started refreshing ${commands.length} application (/) commands.`);
  
  		const data = await rest.put(
  			Routes.applicationCommands(BOT_CLIENT_ID),
  			{ body: commands },
  		);
  
  		console.log(`Successfully reloaded ${data.length} application (/) commands.`);
  	} catch (error) {
  		console.error(error);
  	}
  })();
};