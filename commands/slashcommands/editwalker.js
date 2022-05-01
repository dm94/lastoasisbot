const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("editwalker")
    .setDescription("Edit the walker you want")
    .addIntegerOption((option) =>
      option.setName("walkerid").setDescription("Walker ID").setRequired(true)
    )
    .addBooleanOption((option) =>
      option.setName("ready").setDescription("If is ready").setRequired(true)
    ),
};
