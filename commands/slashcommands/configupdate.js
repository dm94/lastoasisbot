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
    ),
};
