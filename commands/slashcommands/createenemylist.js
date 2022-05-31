const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("createenemylist")
    .setDescription(
      "Create a list of enemy clans. (Only for admins or members with permissions)"
    ),
};
