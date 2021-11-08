const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("lohelp")
    .setDescription("Replies with commands info"),
};
