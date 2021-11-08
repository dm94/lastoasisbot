const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("recipe")
    .setDescription("Displays the list of recipes for that code")
    .addStringOption((option) =>
      option.setName("code").setDescription("The recipe code").setRequired(true)
    ),
};
