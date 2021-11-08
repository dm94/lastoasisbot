const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("walkersearch")
    .setDescription(
      "To search for a walker or several walkers, has different filters"
    )
    .addIntegerOption((option) =>
      option
        .setName("page")
        .setDescription("Page (10 walkers per page)")
        .setRequired(false)
    )
    .addStringOption((option) =>
      option.setName("name").setDescription("Walker Name").setRequired(false)
    )
    .addStringOption((option) =>
      option.setName("owner").setDescription("Walker Owner").setRequired(false)
    )
    .addStringOption((option) =>
      option
        .setName("description")
        .setDescription("Walker Description")
        .setRequired(false)
    )
    .addStringOption((option) =>
      option
        .setName("type")
        .setDescription("Walker Type (Dinghy, Hornet ....)")
        .setRequired(false)
    )
    .addStringOption((option) =>
      option
        .setName("lastuser")
        .setDescription("Filter by who has used the walker the last time")
        .setRequired(false)
    )
    .addBooleanOption((option) =>
      option.setName("ready").setDescription("If is ready").setRequired(false)
    )
    .addStringOption((option) =>
      option
        .setName("use")
        .setDescription("Filter by use")
        .addChoice("PVP", "pvp")
        .addChoice("Farming", "farming")
        .addChoice("Personal", "personal")
        .setRequired(false)
    )
    .addStringOption((option) =>
      option
        .setName("id")
        .setDescription(
          "Enter the walker id if you want to search for a specific walker"
        )
        .setRequired(false)
    ),
};
