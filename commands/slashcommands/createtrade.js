const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("createtrade")
    .setDescription("To create a trade, has different parameters")
    .addStringOption((option) =>
      option
        .setName("resource")
        .setDescription("Resource Name (Aloe Vera, Wood...)")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("type")
        .setDescription("Type of trade")
        .addChoices(
          { name: "Demand", value: "Demand" },
          { name: "Supply", value: "Supply" }
        )
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("region")
        .setDescription("Region")
        .addChoices(
          { name: "EU", value: "EU" },
          { name: "NA-EAST", value: "NA-EAST" },
          { name: "NA-WEST", value: "NA-WEST" },
          { name: "SA", value: "SA" },
          { name: "SEA", value: "SEA" },
          { name: "OCE", value: "OCE" },
          { name: "RUSSIA", value: "RUSSIA" }
        )
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
        .addChoices(
          { name: "Common", value: 0 },
          { name: "Uncommon", value: 1 },
          { name: "Rare", value: 2 },
          { name: "Epic", value: 3 },
          { name: "Legendary", value: 4 }
        )
        .setRequired(false)
    )
    .addIntegerOption((option) =>
      option
        .setName("price")
        .setDescription("The price at which you sell it")
        .setRequired(false)
    ),
};
