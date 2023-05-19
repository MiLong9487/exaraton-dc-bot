import { SlashCommandBuilder } from 'discord.js';

export default {
	data: new SlashCommandBuilder()
		.setName('stop-server')
		.setDescription('stop server'),
  
	execute: async (interaction, server) => {
		try {
      await server.stop();
      await interaction.reply('server stopping');
    } catch (error) {
      await interaction.reply(error.message);
    }
	},
};