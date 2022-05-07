const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("config")
    .setDescription(
      "Shows all the info for the bot config (Only for admins or members with permissions)"
    ),
};
