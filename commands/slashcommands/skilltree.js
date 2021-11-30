const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("skilltree")
    .setDescription("Tells you who in your clan has learned that item.")
    .addStringOption((option) =>
      option.setName("item").setDescription("The item name").setRequired(true)
    ),
};
