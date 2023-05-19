import * as path from 'path';
import { fileURLToPath } from 'url';
import { Events, SlashCommandBuilder } from 'discord.js';

const __filename = fileURLToPath(import.meta.url);
const srcPath = path.join(path.dirname(path.dirname(path.dirname(__filename))), 'common_resources');
const { ChatBridge } = import(path.join(srcPath, 'chat_bridge.js'))


export default {
	data: new SlashCommandBuilder()
		.setName('stop-chat-bridge')
		.setDescription('stop a chat bridge between this chinnel and minecraft server'),
  
	execute: async (interaction) => {
    if (!(interaction.channelId in chatBridges)) {
      await interaction.reply('Chat bridge has not been started.');
      return;
    }

    const chatBridge = chatBridges[interaction.channelId];
    
		server.off("console:line", chatBridge.sendToDiscord);
    
    interaction.client.off(Events.MessageCreate, chatBridge.sendToServer);

    server.unsubscribe()
    
    await interaction.reply('Chat bridge stop!');
	},
};