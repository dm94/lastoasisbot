const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("learned")
    .setDescription("Add the item to the list of learned items")
    .addStringOption((option) =>
      option.setName("item").setDescription("The item name").setRequired(true)
    ),
};
