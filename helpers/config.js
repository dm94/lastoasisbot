const controller = {};
const { EmbedBuilder } = require("discord.js");
require("dotenv").config();
const othersFunctions = require("./others");
const discordlists = require("./discordlists");
const logger = require("../helpers/logger");

let lastConfigurationsUpdate = 0;
const botConfigurations = [];

controller.getConfiguration = (guildID, client) => {
  if (guildID != null) {
    if (lastConfigurationsUpdate <= Date.now() - 3600000) {
      controller.updateConfigurations(client);
    } else {
      return botConfigurations[guildID];
    }
  }
  return null;
};

controller.getConfigurations = async () => {
  const options = {
    method: "get",
    url: process.env.APP_API_URL + "/bot/config",
  };

  const response = await othersFunctions.apiRequest(options);

  if (response.success) {
    return response.data;
  } else {
    return null;
  }
};

controller.sendConfigInfo = async (interaction, guildConfig) => {
  await interaction.deferReply({ ephemeral: true });

  const embed = new EmbedBuilder().setColor("#58ACFA").setTitle("Bot Config");

  embed.addFields(
    { name: "Language", value: guildConfig.botlanguaje, inline: true },
    {
      name: "Read discord clan log",
      value:
        guildConfig.readclanlog && guildConfig.readclanlog != "0"
          ? ":white_check_mark:"
          : ":x:",
      inline: true,
    },
    {
      name: "Automatic kick members from the clan",
      value:
        guildConfig.automatickick && guildConfig.automatickick != "0"
          ? ":white_check_mark:"
          : ":x:",
      inline: true,
    },
    {
      name: "Automatically if a PVP walker is used it is marked as not ready.",
      value:
        guildConfig.setnotreadypvp && guildConfig.setnotreadypvp != "0"
          ? ":white_check_mark:"
          : ":x:",
      inline: false,
    },
    {
      name: "Warns if someone brings out a walker they don't own.",
      value:
        guildConfig.walkeralarm && guildConfig.walkeralarm != "0"
          ? ":white_check_mark:"
          : ":x:",
      inline: false,
    }
  );

  await interaction
    .editReply({
      embeds: [embed],
      ephemeral: true,
    })
    .catch((error) => logger.error(error));
};

controller.updateConfig = async (interaction) => {
  await interaction.deferReply({ ephemeral: true });
  const params = {
    languaje: interaction.options.getString("languaje"),
    clanlog: interaction.options.getBoolean("clanlog"),
    kick: interaction.options.getBoolean("kick"),
    readypvp: interaction.options.getBoolean("readypvp"),
    walkeralarm: interaction.options.getBoolean("walkeralarm"),
  };

  const guildId = interaction.guildId;

  const options = {
    method: "put",
    url: process.env.APP_API_URL + "/bot/config/" + guildId,
    params: params,
  };

  const response = await othersFunctions.apiRequest(options);
  if (response.success) {
    botConfigurations[guildId] = {
      botlanguaje: params.languaje,
      readclanlog: params.clanlog,
      automatickick: params.kick,
      setnotreadypvp: params.readypvp,
      walkeralarm: params.walkeralarm,
    };
    await interaction
      .editReply({
        content: "Config updated",
        ephemeral: true,
      })
      .catch((error) => logger.error(error));
  } else {
    await interaction
      .editReply({
        content: response.data,
        ephemeral: true,
      })
      .catch((error) => logger.error(error));
  }
};

controller.createConfiguration = async (guildId) => {
  const params = {
    languaje: "en",
    clanlog: true,
    kick: false,
    readypvp: false,
    walkeralarm: false,
  };
  const options = {
    method: "put",
    url: process.env.APP_API_URL + "/bot/config/" + guildId,
    params: params,
  };

  await othersFunctions.apiRequest(options);
  botConfigurations[guildId] = {
    botlanguaje: params.languaje,
    readclanlog: params.clanlog,
    automatickick: params.kick,
    setnotreadypvp: params.readypvp,
    walkeralarm: params.walkeralarm,
  };
};

controller.updateConfigurations = async (client) => {
  if (client && client.guilds && client.guilds.cache) {
    const allConfigurations = await controller.getConfigurations();
    client.guilds.cache.forEach((guild) => {
      let config = null;
      if (allConfigurations) {
        config = allConfigurations.find(
          (server) => server.serverdiscordid == guild.id
        );
      }
      if (config) {
        botConfigurations[guild.id] = config;
      }
    });
    lastConfigurationsUpdate = Date.now();

    const guildsCount = client.guilds.cache.size;

    discordlists.updateStatistics(guildsCount);
  }
};

module.exports = controller;
