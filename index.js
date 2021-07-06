require("dotenv").config();
const Discord = require("discord.js");
const client = new Discord.Client();
const genericCommands = require("./commands/generic");
const itemsCommands = require("./commands/items");
const walkerCommands = require("./commands/walkers");
const configuration = require("./helpers/config");

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.login(process.env.DISCORD_TOKEN);
const prefix = process.env.DISCORD_PREFIX;

let botConfigurations = [];

client.on("ready", () => {
  client.user
    .setPresence({
      activity: { name: "!lohelp www.stiletto.live" },
      status: "available",
      url: "https://www.stiletto.live/",
    })
    .catch(console.log);

  updateConfigurations();
});

client.on("message", (msg) => {
  const guildConfig = botConfigurations[msg.guild.id];

  console.log(guildConfig);
  if (guildConfig != null) {
    if (
      guildConfig.readclanlog &&
      msg.content.includes("traveled") &&
      msg.author.bot
    ) {
      let walkerId = 0;
      let walkerName = "";
      let lastUser = "";
      if (/\((\d+)\)/.test(msg.content)) {
        walkerId = parseInt(msg.content.match(/\((\d+)\)/)[1]);
      }
      if (/(?:``)(.+)(?:`` traveled)/.test(msg.content)) {
        lastUser = msg.content.match(/(?:``)(.+)(?:`` traveled)/)[1];
      }
      if (/(?:with walker\s``)(.+)(?:``\s)/.test(msg.content)) {
        walkerName = msg.content.match(/(?:with walker\s``)(.+)(?:``\s)/)[1];
      }

      if (guildConfig.walkerAlarm) {
        walkerCommands.walkerAlarm(
          {
            walkerID: walkerId,
            lastUser: lastUser,
            name: walkerName,
          },
          msg
        );
      }
      walkerCommands.insertNewWalker(
        {
          walkerID: walkerId,
          lastUser: lastUser,
          name: walkerName,
        },
        msg.guild.id
      );

      if (guildConfig.setnotreadypvp) {
        walkerCommands.setnotreadypvp(walkerId, msg);
      }
    }

    if (msg.content.includes("kicked") && msg.author.bot) {
      if (/(?:``)(.+)(?:`` kicked)/.test(msg.content)) {
        lastUser = msg.content.match(/(?:``)(.+)(?:`` kicked)/)[1];

        console.log("Kicked: " + lastUser);
      }
    }
  } else {
    configuration.updateConfiguration(msg.guild.id);
    updateConfigurations();
  }

  if (!msg.content.startsWith(prefix) && msg.author.bot) return;
  const args = msg.content.slice(prefix.length).trim().split(" ");
  const command = args.shift().toLowerCase();

  if (command === "lowalkerinfo") {
    walkerCommands.lowalkerinfo(msg, args, prefix);
  } else if (command === "lolistwalkers") {
    walkerCommands.lolistwalkers(msg);
  } else if (command === "lowalkersearchbyname") {
    walkerCommands.lowalkersearchbyname(msg);
  } else if (command === "lowalkersearchbyowner") {
    walkerCommands.lowalkersearchbyowner(msg);
  } else if (command === "lowalkersearchbylastuser") {
    walkerCommands.lowalkersearchbylastuser(msg);
  } else if (command === "locraft") {
    itemsCommands.locraft(msg, args, prefix);
  } else if (command === "locommands" || command === "lohelp") {
    genericCommands.lohelp(msg, prefix);
  } else if (command === "loinfo") {
    genericCommands.loinfo(msg);
  }
});

async function updateConfigurations() {
  let allConfigurations = await configuration.getConfigurations();
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
}
