const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("tradesearch")
    .setDescription("To perform a search for trades, has different filters")
    .addIntegerOption((option) =>
      option
        .setName("page")
        .setDescription("Page (10 walkers per page)")
        .setRequired(false)
    )
    .addStringOption((option) =>
      option
        .setName("resource")
        .setDescription("Resource Name (Aloe Vera, Wood...)")
        .setRequired(false)
    )
    .addStringOption((option) =>
      option
        .setName("type")
        .setDescription("Filter by type")
        .addChoices(
          { name: "Demand", value: "Demand" },
          { name: "Supply", value: "Supply" }
        )
        .setRequired(false)
    )
    .addStringOption((option) =>
      option
        .setName("region")
        .setDescription("Filter by region")
        .addChoices(
          { name: "EU", value: "EU" },
          { name: "NA-EAST", value: "NA-EAST" },
          { name: "NA-WEST", value: "NA-WEST" },
          { name: "SA", value: "SA" },
          { name: "SEA", value: "SEA" },
          { name: "OCE", value: "OCE" },
          { name: "RUSSIA", value: "RUSSIA" }
        )
        .setRequired(false)
    ),
};
