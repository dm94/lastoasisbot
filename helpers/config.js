const controller = {};
const Discord = require("discord.js");
require("dotenv").config();
const othersFunctions = require("./others");
const discordlists = require("./discordlists");

let lastConfigurationsUpdate = 0;
let botConfigurations = [];

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

  let response = await othersFunctions.apiRequest(options);

  if (response.success) {
    return response.data;
  } else {
    return null;
  }
};

controller.sendConfigInfo = async (interaction, guildConfig) => {
  await interaction.deferReply({ ephemeral: true });

  let embed = new Discord.MessageEmbed()
    .setColor("#58ACFA")
    .setTitle("Bot Config");

  embed.addField("Language", guildConfig.botlanguaje, true);
  embed.addField(
    "Read discord clan log",
    guildConfig.readclanlog && guildConfig.readclanlog != "0"
      ? ":white_check_mark:"
      : ":x:",
    true
  );
  embed.addField(
    "Automatic kick members from the clan",
    guildConfig.automatickick && guildConfig.automatickick != "0"
      ? ":white_check_mark:"
      : ":x:",
    false
  );
  embed.addField(
    "Automatically if a PVP walker is used it is marked as not ready.",
    guildConfig.setnotreadypvp && guildConfig.setnotreadypvp != "0"
      ? ":white_check_mark:"
      : ":x:",
    false
  );
  embed.addField(
    "Warns if someone brings out a walker they don't own.",
    guildConfig.walkeralarm && guildConfig.walkeralarm != "0"
      ? ":white_check_mark:"
      : ":x:",
    false
  );

  await interaction.editReply({
    embeds: [embed],
    ephemeral: true,
  });
};

controller.updateConfig = async (interaction) => {
  await interaction.deferReply({ ephemeral: true });
  let params = {
    languaje: interaction.options.getString("languaje"),
    clanlog: interaction.options.getBoolean("clanlog"),
    kick: interaction.options.getBoolean("kick"),
    readypvp: interaction.options.getBoolean("readypvp"),
    walkeralarm: interaction.options.getBoolean("walkeralarm"),
  };

  let guildId = interaction.guildId;

  const options = {
    method: "put",
    url: process.env.APP_API_URL + "/bot/config/" + guildId,
    params: params,
  };

  let response = await othersFunctions.apiRequest(options);
  if (response.success) {
    botConfigurations[guildId] = {
      botlanguaje: params.languaje,
      readclanlog: params.clanlog,
      automatickick: params.kick,
      setnotreadypvp: params.readypvp,
      walkeralarm: params.walkeralarm,
    };
    await interaction.editReply({
      content: "Config updated",
      ephemeral: true,
    });
  } else {
    await interaction.editReply({
      content: response.data,
      ephemeral: true,
    });
  }
};

controller.createConfiguration = async (guildId) => {
  let params = {
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
    let allConfigurations = await controller.getConfigurations();
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

    let guildsCount = client.guilds.cache.size;

    discordlists.updateStatistics(guildsCount);
  }
};

module.exports = controller;
