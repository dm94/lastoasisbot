const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("createtrade")
    .setDescription("To create a trade, has different parameters")
    .addStringOption((option) =>
      option
        .setName("resource")
        .setDescription("Resource Name (Aloe, Wood...)")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("type")
        .setDescription("Type of trade")
        .addChoice("Demand", "Demand")
        .addChoice("Supply", "Supply")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("region")
        .setDescription("Region")
        .addChoice("EU", "EU")
        .addChoice("NA-EAST", "NA-EAST")
        .addChoice("NA-WEST", "NA-WEST")
        .addChoice("SA", "SA")
        .addChoice("SEA", "SEA")
        .addChoice("OCE", "OCE")
        .addChoice("RUSSIA", "RUSSIA")
        .setRequired(true)
    )
    .addIntegerOption((option) =>
      option
        .setName("amount")
        .setDescription("The quantity you sell")
        .setRequired(false)
    )
    .addIntegerOption((option) =>
      option
        .setName("quality")
        .setDescription("The quality you sell")
        .setRequired(false)
    )
    .addIntegerOption((option) =>
      option
        .setName("price")
        .setDescription("The price at which you sell it")
        .setRequired(false)
    ),
};
