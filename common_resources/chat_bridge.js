export class ChayBridge{
  constructor (interaction, server) {
    this.channel = interaction.channel
    this.server = server
  }
  async sendToDiscord (data) {
    await this.channel.send(data.line);
  };
  
  async sendToServer (msg) {
    if (msg.member.user.bot) return;
    if (msg.channel !== this.channel) return;
    try {
      await this.server.executeCommand("say " + msg.content);
    } catch (error) {
      await msg.channel.send(error.message);
    }
  };
}