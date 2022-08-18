const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("configupdate")
    .setDescription(
      "To update the bot configuration (Only for admins or members with permissions)"
    )
    .addStringOption((option) =>
      option
        .setName("languaje")
        .setDescription("Bot Languaje")
        .addChoices(
          { name: "EN", value: "en" },
          { name: "ES", value: "es" },
          { name: "DE", value: "de" },
          { name: "FR", value: "fr" },
          { name: "IT", value: "it" },
          { name: "JA", value: "ja" },
          { name: "PL", value: "pl" },
          { name: "PT", value: "pt" },
          { name: "RU", value: "ru" },
          { name: "ZH", value: "zh" }
        )
        .setRequired(true)
    )
    .addBooleanOption((option) =>
      option
        .setName("clanlog")
        .setDescription("For reading the clan log")
        .setRequired(true)
    )
    .addBooleanOption((option) =>
      option
        .setName("kick")
        .setDescription(
          "If you want to automatically kick out of the website those who are kicked out in the game"
        )
        .setRequired(true)
    )
    .addBooleanOption((option) =>
      option
        .setName("readypvp")
        .setDescription(
          "If you want to automatically mark as not ready the used pvp walkers"
        )
        .setRequired(true)
    )
    .addBooleanOption((option) =>
      option
        .setName("walkeralarm")
        .setDescription(
          "If you want the bot to warn you if someone uses a walker that has another owner"
        )
        .setRequired(true)
    ),
};
