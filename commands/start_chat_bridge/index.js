import * as path from 'path';
import { fileURLToPath } from 'url';
import { Events, SlashCommandBuilder } from 'discord.js';

const __filename = fileURLToPath(import.meta.url);
const srcPath = path.join(path.dirname(path.dirname(path.dirname(__filename))), 'common_resources');
const { ChatBridge } = import(path.join(srcPath, 'chat_bridge.js'));

export default {
	data: new SlashCommandBuilder()
		.setName('start-chat-bridge')
		.setDescription('start a chat bridge between this chinnel and minecraft server'),
  
	execute: async (interaction) => {
    if (interaction.channelId in chatBridges) {
      await interaction.reply('Chat bridge can not be started twice.');
      return;
    }

    server.subscribe();
    const chatBridge = new ChatBridge(interaction, server);
    chatBridges[interaction.channelId] = chatBridge;
    
		server.on("console:line", chatBridge.sendToDiscord);
    
    interaction.client.on(Events.MessageCreate, chatBridge.sendToServer);
    
    await interaction.reply('Chat bridge start!');
	},
};