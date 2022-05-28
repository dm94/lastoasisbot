const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("vote")
    .setDescription("Information for voting and helping the bot"),
};
