require("dotenv").config();
const { Client, GatewayIntentBits, InteractionType } = require("discord.js");
const genericCommands = require("./commands/generic");
const walkerCommands = require("./commands/walkers");
const clanCommands = require("./commands/clans");
const configuration = require("./helpers/config");
const slashCommandsRegister = require("./slashCommandsRegister");
const logger = require("./helpers/logger");

const autocompleteController = require("./commands/interaction_types/autocomplete");
const buttonController = require("./commands/interaction_types/button");
const commandController = require("./commands/interaction_types/command");

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
});

client.on("ready", () => {
  logger.info(`Logged in as ${client.user.tag}!`);
});

client.login(process.env.DISCORD_TOKEN);

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
    if (interaction.type === InteractionType.ApplicationCommandAutocomplete) {
      await autocompleteController.router(interaction);
    } else if (interaction.isButton()) {
      await buttonController.router(interaction);
    } else if (interaction.type === InteractionType.ApplicationCommand) {
      if (interaction.commandName === "lohelp") {
        await interaction.reply(
          genericCommands.getHelpContent(slashCommandsRegister.getCommands())
        );
      } else {
        await commandController.router(interaction, client);
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
          Boolean(guildConfig.readclanlog) &&
          msg.content.includes("traveled") &&
          msg.author.bot
        ) {
          let walkerId = 0;
          let walkerName = "";
          let lastUser = "";
          if (/\((\d+)\)/.test(msg.content)) {
            try {
              walkerId = parseInt(msg.content.match(/\((\d+)\)/)[1]);
            } catch (error) {
              console.error(error);
            }
          }
          if (/(?:``)(.+)(?:`` traveled)/.test(msg.content)) {
            lastUser = msg.content.match(/(?:``)(.+)(?:`` traveled)/)[1];
          }
          if (/(?:with walker\s``)(.+)(?:``\s)/.test(msg.content)) {
            walkerName = msg.content.match(
              /(?:with walker\s``)(.+)(?:``\s)/
            )[1];
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

        if (
          Boolean(guildConfig.automatickick) &&
          msg.content.includes("kicked") &&
          msg.author.bot
        ) {
          if (/(?:``)(.+)(?:`` kicked)/.test(msg.content)) {
            const user = msg.content.match(/(?:``)(.+)(?:`` kicked)/)[1];
            clanCommands.kickMember(msg, user);
          }
        }
      } else {
        configuration.createConfiguration(msg.guild.id);
      }
    }
  } catch (e) {
    logger.error(e);
  }
});
