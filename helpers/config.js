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

controller.loconfig = (msg, prefix, guildConfig) => {
  controller.sendConfigInfo(msg.channel, guildConfig);
  let messageEn =
    prefix +
    "loconfigupdate = To update the bot configuration. Use this parameters with her value. Only For Admins \n" +
    "```" +
    "For change the language: -language=EN|ES|DE|FR|IT|JA|PL|PT|RU|ZH \n" +
    "For reading the clan log: -clanlog=true|false \n" +
    "If you want to automatically kick out of the website those who are kicked out in the game: -kick=true|false \n" +
    "If you want to automatically mark as not ready the used pvp walkers: -readypvp=true|false \n" +
    "If you want me to warn you if someone uses a walker that they do not own: -walkeralarm=true|false \n" +
    "\nExample with the default options:" +
    "```" +
    "```" +
    prefix +
    "loconfigupdate -language=EN -clanlog=true -kick=false -readypvp=false -walkeralarm=false```";

  othersFunctions.sendChannelMessage(msg.channel, messageEn);
};

controller.sendConfigInfo = (channel, guildConfig) => {
  let message = new Discord.MessageEmbed()
    .setColor("#58ACFA")
    .setTitle("Bot Config");

  message.addField("Language", guildConfig.botlanguaje, true);
  message.addField(
    "Read discord clan log",
    guildConfig.readclanlog && guildConfig.readclanlog != "0"
      ? ":white_check_mark:"
      : ":x:",
    true
  );
  message.addField(
    "Automatic kick members from the clan",
    guildConfig.automatickick && guildConfig.automatickick != "0"
      ? ":white_check_mark:"
      : ":x:",
    false
  );
  message.addField(
    "Automatically if a PVP walker is used it is marked as not ready.",
    guildConfig.setnotreadypvp && guildConfig.setnotreadypvp != "0"
      ? ":white_check_mark:"
      : ":x:",
    false
  );
  message.addField(
    "Warns if someone brings out a walker they don't own.",
    guildConfig.walkeralarm && guildConfig.walkeralarm != "0"
      ? ":white_check_mark:"
      : ":x:",
    false
  );

  othersFunctions.sendChannelEmbed(channel, message);
};

controller.loconfigupdate = async (msg, prefix, guildConfig) => {
  let guildId = msg.guild.id;
  let args = msg.content.slice(prefix.length).trim().split(" -");
  let params = {
    languaje: "en",
    clanlog: true,
    kick: false,
    readypvp: false,
    walkeralarm: false,
  };

  if (guildConfig != null) {
    params = {
      languaje: guildConfig.botlanguaje,
      clanlog: guildConfig.readclanlog == true,
      kick: guildConfig.automatickick == true,
      readypvp: guildConfig.setnotreadypvp == true,
      walkeralarm: guildConfig.walkerAlarm == true,
    };
  }

  args.forEach((arg) => {
    let value = "";
    if (arg.startsWith("language=")) {
      value = arg.slice(9).trim().toLowerCase();
      if (
        value == "es" ||
        value == "en" ||
        value == "de" ||
        value == "fr" ||
        value == "it" ||
        value == "ja" ||
        value == "pl" ||
        value == "pt" ||
        value == "ru" ||
        value == "zh"
      ) {
        params.languaje = value;
      }
    } else if (arg.startsWith("clanlog=")) {
      value = arg.slice(8).trim().toLowerCase();
      if (value == "true" || value == "false") {
        params.clanlog = value;
      }
    } else if (arg.startsWith("kick=")) {
      value = arg.slice(5).trim().toLowerCase();
      if (value == "true" || value == "false") {
        params.kick = value;
      }
    } else if (arg.startsWith("readypvp=")) {
      value = arg.slice(9).trim().toLowerCase();
      if (value == "true" || value == "false") {
        params.readypvp = value;
      }
    } else if (arg.startsWith("walkeralarm=")) {
      value = arg.slice(12).trim().toLowerCase();
      if (value == "true" || value == "false") {
        params.walkeralarm = value;
      }
    }
  });
  controller.updateConfig(msg.channel, guildId, params);
};

controller.updateConfig = async (channel, guildId, params) => {
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
  othersFunctions.sendChannelMessage(channel, "Config updated");
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
    let usersCount =
      client.users && client.users.cache ? client.users.cache.size : 0;

    discordlists.updateStatistics(guildsCount, usersCount);
  }
};

module.exports = controller;
