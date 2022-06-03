require("dotenv").config();
const { Client, Intents } = require("discord.js");
const { Permissions } = require("discord.js");
const genericCommands = require("./commands/generic");
const itemsCommands = require("./commands/items");
const walkerCommands = require("./commands/walkers");
const clanCommands = require("./commands/clans");
const tradesCommands = require("./commands/trades");
const techCommands = require("./commands/tech");
const configuration = require("./helpers/config");
const clanPermissions = require("./helpers/permissions");
const slashCommandsRegister = require("./slashCommandsRegister");
const logger = require("./helpers/logger");

const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_MESSAGE_TYPING,
  ],
});

let stats = {
  help: 0,
  info: 0,
  craft: 0,
  recipe: 0,
  walkerinfo: 0,
  walkersearch: 0,
  editwalker: 0,
  tradesearch: 0,
  createtrade: 0,
  config: 0,
  configupdate: 0,
  linkserver: 0,
  createwalkerlist: 0,
  skilltree: 0,
  learned: 0,
  lowalkerinfo: 0,
  lowalkersearch: 0,
  locraft: 0,
  lorecipe: 0,
  lotradesearch: 0,
  locreatetrade: 0,
  lohelp: 0,
  obsolete: 0,
  loinfo: 0,
};

client.on("ready", () => {
  logger.info(`Logged in as ${client.user.tag}!`);
});

client.login(process.env.DISCORD_TOKEN);
const defaultPrefix = process.env.DISCORD_PREFIX;

client.on("ready", () => {
  configuration.updateConfigurations(client);

  if (process.env.APP_DEV) {
    logger.info("Dev Mode");
    client.guilds.cache.forEach((guild) => {
      slashCommandsRegister.registerSlashCommands(guild.id);
    });
    console.log("Servers:" + client.guilds.cache.size);
  } else {
    slashCommandsRegister.registerSlashCommandsGlobal();
  }
});

client.on("interactionCreate", async (interaction) => {
  try {
    if (!interaction.isCommand() && !interaction.isButton()) return;

    if (interaction.commandName === "lohelp") {
      stats.help++;
      await interaction.reply(genericCommands.getHelpContent(defaultPrefix));
    } else if (interaction.commandName === "vote") {
      await interaction.reply(
        "Help us grow by voting here: https://top.gg/bot/" +
          process.env.DISCORD_CLIENT_ID
      );
    } else if (interaction.commandName === "loinfo") {
      stats.info++;
      await interaction.reply({ embeds: [genericCommands.getInfoContent()] });
    } else if (interaction.commandName === "craft") {
      stats.craft++;
      await interaction.reply("Looking for items");
      itemsCommands.getNecessaryMaterials(
        interaction.channel,
        interaction.options.getString("item").trim().toLowerCase(),
        interaction.options.getInteger("quantity")
          ? interaction.options.getInteger("quantity")
          : 1
      );
    } else if (interaction.commandName === "recipe") {
      stats.recipe++;
      await interaction.reply("Looking for items");
      itemsCommands.sendRecipe(
        interaction.channel,
        interaction.options.getString("code").trim()
      );
    } else if (interaction.commandName === "walkerinfo") {
      stats.walkerinfo++;
      let walkerId = interaction.options.getString("id").trim();
      await interaction.reply("Looking for the walker with id: " + walkerId);
      walkerCommands.sendWalkerInfoFromID(
        interaction.channel,
        walkerId,
        interaction.guildId
      );
    } else if (interaction.commandName === "walkersearch") {
      stats.walkersearch++;
      let params = {
        discordid: interaction.guildId,
      };
      params.page = interaction.options.getInteger("page")
        ? interaction.options.getInteger("page")
        : 1;
      params.name = interaction.options.getString("name")
        ? interaction.options.getString("name").trim()
        : undefined;
      params.owner = interaction.options.getString("owner")
        ? interaction.options.getString("owner").trim()
        : undefined;
      params.lastuser = interaction.options.getString("lastuser")
        ? interaction.options.getString("lastuser").trim()
        : undefined;
      params.desc = interaction.options.getString("description")
        ? interaction.options.getString("description").trim()
        : undefined;
      params.type = interaction.options.getString("type")
        ? interaction.options.getString("type").trim()
        : undefined;
      params.ready = interaction.options.getBoolean("ready") ? 1 : undefined;
      params.use = interaction.options.getString("use")
        ? interaction.options.getString("use")
        : undefined;
      params.walkerid = interaction.options.getString("id")
        ? interaction.options.getString("id")
        : undefined;
      await interaction.reply("Looking for walkers...");
      walkerCommands.walkerSearchWithParams(interaction.channel, params);
    } else if (interaction.commandName === "editwalker") {
      if (
        interaction.member.permissions.has("ADMINISTRATOR") ||
        (await clanPermissions.userHasPermissions(
          interaction.guildId,
          interaction.member.id,
          "walkers"
        ))
      ) {
        stats.editwalker++;
        walkerCommands.editWalker(interaction);
      } else {
        await interaction.reply(
          "You do not have permissions to use this command"
        );
      }
    } else if (interaction.commandName === "tradesearch") {
      stats.tradesearch++;
      let params = {
        discordid: interaction.member.id,
      };
      params.page = interaction.options.getInteger("page")
        ? interaction.options.getInteger("page")
        : 1;
      params.resource = interaction.options.getString("resource")
        ? interaction.options.getString("resource").trim()
        : undefined;
      params.region = interaction.options.getString("region")
        ? interaction.options.getString("region").trim()
        : undefined;
      params.type = interaction.options.getString("type")
        ? interaction.options.getString("type").trim()
        : undefined;
      await interaction.reply("Looking for trades...");
      tradesCommands.tradeSearchWithParams(interaction.channel, params);
    } else if (interaction.commandName === "createtrade") {
      stats.createtrade++;
      tradesCommands.createtrade(interaction);
    } else if (interaction.commandName === "config") {
      if (
        interaction.member.permissions.has("ADMINISTRATOR") ||
        (await clanPermissions.userHasPermissions(
          interaction.guildId,
          interaction.member.id,
          "bot"
        ))
      ) {
        stats.config++;
        let guildConfig = configuration.getConfiguration(
          interaction.guildId,
          client
        );
        if (guildConfig) {
          configuration.sendConfigInfo(interaction, guildConfig);
        } else {
          await interaction.reply("Bot is not configured in this discord");
        }
      } else {
        await interaction.reply(
          "You do not have permissions to use this command"
        );
      }
    } else if (interaction.commandName === "configupdate") {
      if (
        interaction.member.permissions.has("ADMINISTRATOR") ||
        (await clanPermissions.userHasPermissions(
          interaction.guildId,
          interaction.member.id,
          "bot"
        ))
      ) {
        stats.configupdate++;
        configuration.updateConfig(interaction);
      } else {
        await interaction.reply(
          "You do not have permissions to use this command"
        );
      }
    } else if (interaction.commandName === "linkserver") {
      if (
        interaction.member.permissions.has("ADMINISTRATOR") ||
        (await clanPermissions.userHasPermissions(
          interaction.guildId,
          interaction.member.id,
          "bot"
        ))
      ) {
        stats.linkserver++;
        clanCommands.linkserver(interaction);
      } else {
        await interaction.reply(
          "You do not have permissions to use this command"
        );
      }
    } else if (interaction.commandName === "createwalkerlist") {
      if (
        interaction.member.permissions.has("ADMINISTRATOR") ||
        (await clanPermissions.userHasPermissions(
          interaction.guildId,
          interaction.member.id,
          "walkers"
        ))
      ) {
        stats.createwalkerlist++;
        walkerCommands.createWalkerList(interaction);
      } else {
        await interaction.reply(
          "You do not have permissions to use this command"
        );
      }
    } else if (
      interaction.commandName === "createsettlerslist" ||
      interaction.commandName === "createalliancelist" ||
      interaction.commandName === "createenemylist"
    ) {
      if (
        interaction.member.permissions.has("ADMINISTRATOR") ||
        (await clanPermissions.userHasPermissions(
          interaction.guildId,
          interaction.member.id,
          "diplomacy"
        ))
      ) {
        clanCommands.createDiplomacyList(interaction);
      } else {
        await interaction.reply(
          "You do not have permissions to use this command"
        );
      }
    } else if (interaction.commandName === "skilltree") {
      stats.skilltree++;
      techCommands.getWhoHasLearntIt(interaction);
    } else if (interaction.commandName === "learned") {
      stats.learned++;
      techCommands.addTech(interaction);
    } else if (interaction.isButton()) {
      if (interaction.customId == "updateWalkerList") {
        await interaction.deferUpdate();
        walkerCommands.updateWalkerList(interaction);
      } else if (interaction.customId.includes("updateDiplomacyList-")) {
        await interaction.deferUpdate();
        clanCommands.updateDiplomacyList(interaction);
      }
    }
  } catch (e) {
    logger.error(e);
  }
});

client.on("messageCreate", (msg) => {
  try {
    let guildConfig = null;
    if (msg.guild.id) {
      guildConfig = configuration.getConfiguration(msg.guild.id, client);

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
            clanCommands.kickMember(msg, user);
          }
        }

        let prefix = defaultPrefix;

        if (!msg.content.startsWith(prefix) || msg.author.bot) return;

        const args = msg.content.slice(prefix.length).trim().split(" ");
        const command = args.shift().toLowerCase();

        if (command === "lostats" && msg.author.id == "82444319507615744") {
          msg.channel.send(JSON.stringify(stats)).catch((e) => {
            console.log(e);
          });
        } else if (command === "lowalkerinfo") {
          stats.lowalkerinfo++;
          walkerCommands.lowalkerinfo(msg, args, prefix);
        } else if (command === "walkersearch") {
          stats.lowalkersearch++;
          walkerCommands.walkersearch(msg, prefix);
        } else if (command === "locraft") {
          stats.locraft++;
          itemsCommands.locraft(msg, args, prefix);
        } else if (command === "lorecipe") {
          stats.lorecipe++;
          itemsCommands.lorecipe(msg, args, prefix);
        } else if (command === "tradesearch") {
          stats.tradesearch++;
          tradesCommands.tradesearch(msg, prefix);
        } else if (command === "locommands" || command === "lohelp") {
          stats.lohelp++;
          genericCommands.lohelp(msg, prefix);
        } else if (command === "loinfo") {
          stats.loinfo++;
          genericCommands.loinfo(msg);
        } else if (
          command === "lolistwalkers" ||
          command === "lowalkersearchbyname" ||
          command === "lowalkersearchbyowner" ||
          command === "lowalkersearchbylastuser" ||
          command === "skilltree" ||
          command === "learned" ||
          command === "loconfig" ||
          command === "linkserver" ||
          command === "loconfigupdate" ||
          command === "createtrade"
        ) {
          stats.obsolete++;
          genericCommands.obsoleteCommand(msg);
        }
      } else {
        configuration.createConfiguration(msg.guild.id);
      }
    }
  } catch (e) {
    logger.error(e);
  }
});
