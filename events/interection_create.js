import { Events } from 'discord.js';

export default {
	name: Events.InteractionCreate,
	async execute(interaction, server, chatBridges) {
		if (!interaction.isChatInputCommand()) return;

		const command = interaction.client.commands.get(interaction.commandName);

		if (!command) {
			console.error(`No command matching ${interaction.commandName} was found.`);
			return;
		}

		try {
			await command.execute({interaction: interaction, server: server, chatBridges: chatBridges});
		} catch (error) {
			console.error(`Error executing ${interaction.commandName}`);
			console.error(error);
		}
	},
};