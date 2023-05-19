import { SlashCommandBuilder } from 'discord.js';

export default {
	data: new SlashCommandBuilder()
		.setName('start-server')
		.setDescription('start server'),
  
	execute: async (interaction, server) => {
		try {
      await server.start();
      await interaction.reply('server starting');
    } catch (error) {
      await interaction.reply(error.message);
    }
	},
};