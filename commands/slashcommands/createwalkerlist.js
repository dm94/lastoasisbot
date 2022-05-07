const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("createwalkerlist")
    .setDescription(
      "Generates a list of clan walkers that are ready. (Only for admins or members with permissions)"
    ),
};
