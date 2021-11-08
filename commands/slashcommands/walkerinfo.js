const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("walkerinfo")
    .setDescription("Shows the information of a specific walker")
    .addStringOption((option) =>
      option.setName("id").setDescription("Walker ID").setRequired(true)
    ),
};
