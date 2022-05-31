const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("createalliancelist")
    .setDescription(
      "Create a list of allied clans. (Only for admins or members with permissions)"
    ),
};
