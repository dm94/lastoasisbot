const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("configupdate")
    .setDescription("To update the bot configuration (Only for admins)")
    .addStringOption((option) =>
      option
        .setName("languaje")
        .setDescription("Bot Languaje")
        .addChoice("EN", "en")
        .addChoice("ES", "es")
        .addChoice("DE", "de")
        .addChoice("FR", "fr")
        .addChoice("IT", "it")
        .addChoice("JA", "ja")
        .addChoice("PL", "pl")
        .addChoice("PT", "pt")
        .addChoice("RU", "ru")
        .addChoice("ZH", "zh")
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
