const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("linkserver")
    .setDescription(
      "Link the discord server to the clan you are in. (Only for admins)"
    ),
};
