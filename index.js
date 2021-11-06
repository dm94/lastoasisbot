require("dotenv").config();
const Discord = require("discord.js");
const { Permissions } = require("discord.js");
const client = new Discord.Client();
const genericCommands = require("./commands/generic");
const itemsCommands = require("./commands/items");
const walkerCommands = require("./commands/walkers");
const clanCommands = require("./commands/clans");
const tradesCommands = require("./commands/trades");
const configuration = require("./helpers/config");

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.login(process.env.DISCORD_TOKEN);
const prefix = process.env.DISCORD_PREFIX;

client.on("ready", () => {
  client.user
    .setPresence({
      activity: { name: "!lohelp www.stiletto.live" },
      status: "available",
      url: "https://www.stiletto.live/",
    })
    .catch(console.log);

  configuration.updateConfigurations(client);
});

client.on("message", (msg) => {
  try {
    let guildConfig = null;
    if (msg.guild.id) {
      guildConfig = configuration.getConfiguration(msg.guild.id);

      if (guildConfig != null) {
        if (
          guildConfig.readclanlog == true &&
          msg.content.includes("traveled") &&
          msg.author.bot
        ) {
          let walkerId = 0;
          let walkerName = "";
          let lastUser = "";
          if (/\((\d+)\)/.test(msg.content)) {
            try {
              walkerId = parseInt(msg.content.match(/\((\d+)\)/)[1]);
            } catch (error) {}
          }
          if (/(?:``)(.+)(?:`` traveled)/.test(msg.content)) {
            lastUser = msg.content.match(/(?:``)(.+)(?:`` traveled)/)[1];
          }
          if (/(?:with walker\s``)(.+)(?:``\s)/.test(msg.content)) {
            walkerName = msg.content.match(
              /(?:with walker\s``)(.+)(?:``\s)/
            )[1];
          }

          if (guildConfig.walkerAlarm == true) {
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

          if (guildConfig.setnotreadypvp == true) {
            walkerCommands.setnotreadypvp(walkerId, msg);
          }
        }

        if (
          guildConfig.automatickick == true &&
          msg.content.includes("kicked") &&
          msg.author.bot
        ) {
          if (/(?:``)(.+)(?:`` kicked)/.test(msg.content)) {
            let user = msg.content.match(/(?:``)(.+)(?:`` kicked)/)[1];
            clanCommands.kickPlayer(msg, user);
          }
        }

        if (!msg.content.startsWith(prefix) || msg.author.bot) return;

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
        } else if (command === "walkersearch") {
          walkerCommands.walkersearch(msg, prefix);
        } else if (command === "locraft") {
          itemsCommands.locraft(msg, args, prefix);
        } else if (command === "lorecipe") {
          itemsCommands.lorecipe(msg, args, prefix);
        } else if (command === "tradesearch") {
          tradesCommands.tradesearch(msg, prefix);
        } else if (command === "createtrade") {
          tradesCommands.createtrade(msg, prefix);
        } else if (command === "locommands" || command === "lohelp") {
          genericCommands.lohelp(msg, prefix);
        } else if (command === "loinfo") {
          genericCommands.loinfo(msg);
        } else if (command === "loconfig") {
          if (msg.member.hasPermission("ADMINISTRATOR")) {
            configuration.loconfig(msg, prefix, guildConfig);
          } else {
            msg.reply("You do not have permissions to use this command");
          }
        } else if (command === "loconfigupdate") {
          if (msg.member.hasPermission("ADMINISTRATOR")) {
            configuration.loconfigupdate(msg, prefix, guildConfig);
          } else {
            msg.reply("You do not have permissions to use this command");
          }
        }
      } else {
        configuration.createConfiguration(msg.guild.id);
      }
    }
  } catch (e) {
    console.log(e);
  }
});
