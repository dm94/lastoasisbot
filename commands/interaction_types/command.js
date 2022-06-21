const walkerCommands = require("../walkers");
const clanCommands = require("../clans");
const techCommands = require("../tech");
const genericCommands = require("../generic");
const itemsCommands = require("../items");
const clanPermissions = require("../../helpers/permissions");
const configuration = require("../../helpers/config");
const logger = require("../../helpers/logger");

const defaultPrefix = process.env.DISCORD_PREFIX;

const controller = {};

controller.router = async (interaction) => {
  try {
    if (interaction.commandName === "lohelp") {
      await interaction.reply(genericCommands.getHelpContent(defaultPrefix));
    } else if (interaction.commandName === "vote") {
      await interaction.reply(
        "Help us grow by voting here: https://top.gg/bot/" +
          process.env.DISCORD_CLIENT_ID
      );
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
      if (await controller.hasPermissions(interaction, "walkers")) {
        walkerCommands.editWalker(interaction);
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
      tradesCommands.createtrade(interaction);
    } else if (interaction.commandName === "config") {
      if (await controller.hasPermissions(interaction, "bot")) {
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
      if (await controller.hasPermissions(interaction, "bot")) {
        configuration.updateConfig(interaction);
      } else {
        await interaction.reply(
          "You do not have permissions to use this command"
        );
      }
    } else if (interaction.commandName === "linkserver") {
      if (await controller.hasPermissions(interaction, "bot")) {
        clanCommands.linkserver(interaction);
      } else {
        await interaction.reply(
          "You do not have permissions to use this command"
        );
      }
    } else if (interaction.commandName === "createwalkerlist") {
      if (await controller.hasPermissions(interaction, "walkers")) {
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
      if (await controller.hasPermissions(interaction, "diplomacy")) {
        clanCommands.createDiplomacyList(interaction);
      } else {
        await interaction.reply(
          "You do not have permissions to use this command"
        );
      }
    } else if (interaction.commandName === "skilltree") {
      techCommands.getWhoHasLearntIt(interaction);
    } else if (interaction.commandName === "learned") {
      techCommands.addTech(interaction);
    }
  } catch (e) {
    logger.error(e);
  }
};

controller.hasPermissions = async (interaction, permission = "bot") => {
  return (
    interaction.member.permissions.has("ADMINISTRATOR") ||
    (await clanPermissions.userHasPermissions(
      interaction.guildId,
      interaction.member.id,
      permission
    ))
  );
};

module.exports = controller;
