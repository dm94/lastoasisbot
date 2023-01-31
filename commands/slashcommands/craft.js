const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("craft")
    .setDescription(
      "With this command you can see the materials needed to make an item"
    )
    .addStringOption((option) =>
      option
        .setName("item")
        .setDescription("The item name. Auto completed with more than 5 words.")
        .setRequired(true)
        .setAutocomplete(true)
    )
    .addIntegerOption((option) =>
      option
        .setName("quantity")
        .setDescription("If you want more than one")
        .setRequired(false)
    ),
};
