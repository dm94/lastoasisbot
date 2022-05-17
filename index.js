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
      await interaction.reply(genericCommands.getHelpContent(defaultPrefix));
    } else if (interaction.commandName === "loinfo") {
      await interaction.reply({ embeds: [genericCommands.getInfoContent()] });
    } else if (interaction.commandName === "craft") {
      await interaction.reply("Looking for items");
      itemsCommands.getNecessaryMaterials(
        interaction.channel,
        interaction.options.getString("item").trim().toLowerCase(),
        interaction.options.getInteger("quantity")
          ? interaction.options.getInteger("quantity")
          : 1
      );
    } else if (interaction.commandName === "recipe") {
      await interaction.reply("Looking for items");
      itemsCommands.sendRecipe(
        interaction.channel,
        interaction.options.getString("code").trim()
      );
    } else if (interaction.commandName === "walkerinfo") {
      let walkerId = interaction.options.getString("id").trim();
      await interaction.reply("Looking for the walker with id: " + walkerId);
      walkerCommands.sendWalkerInfoFromID(
        interaction.channel,
        walkerId,
        interaction.guildId
      );
    } else if (interaction.commandName === "walkersearch") {
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
        let params = {};
        params.walkerid = interaction.options.getInteger("walkerid");
        params.ready = interaction.options.getBoolean("ready") ? 1 : 0;
        await interaction.reply("Updating the walker...");
        walkerCommands.editWalker(
          interaction.guildId,
          interaction.channel,
          params,
          true
        );
      } else {
        await interaction.reply(
          "You do not have permissions to use this command"
        );
      }
    } else if (interaction.commandName === "tradesearch") {
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
      let params = {
        discordid: interaction.member.id,
        type: "Supply",
        resource: "Aloe Vera",
        amount: 0,
        quality: 0,
        region: "eu",
        price: 0,
      };
      let allItems = await itemsCommands.getAllItems();
      let resourceName = interaction.options
        .getString("resource")
        .toLowerCase();
      let item = allItems.find(
        (item) => item.name.toLowerCase() == resourceName
      );
      if (item) {
        await interaction.reply("Creating the trade...");
        params.resource = item.name;
        params.region = interaction.options.getString("region")
          ? interaction.options.getString("region").trim()
          : "EU";
        params.type = interaction.options.getString("type")
          ? interaction.options.getString("type").trim()
          : "Supply";
        params.amount = interaction.options.getInteger("amount")
          ? interaction.options.getInteger("amount")
          : 0;
        params.quality = interaction.options.getInteger("quality")
          ? interaction.options.getInteger("quality")
          : 0;
        params.price = interaction.options.getInteger("price")
          ? interaction.options.getInteger("price")
          : 0;
        tradesCommands.createTradeWithParams(interaction.channel, params);
      } else {
        await interaction.reply("No resource with this name has been found");
      }
    } else if (interaction.commandName === "config") {
      if (
        interaction.member.permissions.has("ADMINISTRATOR") ||
        (await clanPermissions.userHasPermissions(
          interaction.guildId,
          interaction.member.id,
          "bot"
        ))
      ) {
        let guildConfig = configuration.getConfiguration(
          interaction.guildId,
          client
        );
        if (guildConfig) {
          await interaction.reply("This is the bot configuration");
          configuration.sendConfigInfo(interaction.channel, guildConfig);
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
        let params = {
          languaje: interaction.options.getString("languaje"),
          clanlog: interaction.options.getBoolean("clanlog"),
          kick: interaction.options.getBoolean("kick"),
          readypvp: interaction.options.getBoolean("readypvp"),
          walkeralarm: interaction.options.getBoolean("walkeralarm"),
        };
        await interaction.reply("Updating the bot configuration...");
        configuration.updateConfig(
          interaction.channel,
          interaction.guildId,
          params
        );
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
        clanCommands.linkserver(
          interaction.channel,
          interaction.guildId,
          interaction.member.id
        );
        await interaction.reply("Linking the server...");
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
        await interaction.reply("Generating the list");
        walkerCommands.createWalkerList(interaction);
      } else {
        await interaction.reply(
          "You do not have permissions to use this command"
        );
      }
    } else if (interaction.commandName === "skilltree") {
      await interaction.reply("Looking for items");
      techCommands.getWhoHasLearntIt(
        interaction.channel,
        interaction.options.getString("item").trim().toLowerCase(),
        interaction.guildId
      );
    } else if (interaction.commandName === "learned") {
      await interaction.reply("Looking for items");
      techCommands.addTech(
        interaction.channel,
        interaction.options.getString("item").trim().toLowerCase(),
        interaction.member.id
      );
    } else if (interaction.isButton()) {
      if (interaction.customId == "updateWalkerList") {
        await interaction.deferUpdate();
        walkerCommands.updateWalkerList(interaction);
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

        if (command === "lowalkerinfo") {
          walkerCommands.lowalkerinfo(msg, args, prefix);
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
        } else if (
          command === "lolistwalkers" ||
          command === "lowalkersearchbyname" ||
          command === "lowalkersearchbyowner" ||
          command === "lowalkersearchbylastuser" ||
          command === "skilltree" ||
          command === "learned" ||
          command === "loconfig" ||
          command === "linkserver" ||
          command === "loconfigupdate"
        ) {
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
