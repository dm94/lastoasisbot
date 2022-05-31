const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("createsettlerslist")
    .setDescription(
      "Generate a list of clans that are settlers or NAPs. (Only for admins or members with permissions)"
    ),
};
