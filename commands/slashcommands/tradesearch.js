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
        .setDescription("Resource Name (Aloe, Wood...)")
        .setRequired(false)
    )
    .addStringOption((option) =>
      option
        .setName("type")
        .setDescription("Filter by type")
        .addChoice("Demand", "demand")
        .addChoice("Supply", "supply")
        .setRequired(false)
    )
    .addStringOption((option) =>
      option
        .setName("region")
        .setDescription("Filter by region")
        .addChoice("EU", "EU")
        .addChoice("NA-EAST", "NA-EAST")
        .addChoice("NA-WEST", "NA-WEST")
        .addChoice("SA", "SA")
        .addChoice("SEA", "SEA")
        .addChoice("OCE", "OCE")
        .addChoice("RUSSIA", "RUSSIA")
        .setRequired(false)
    ),
};
