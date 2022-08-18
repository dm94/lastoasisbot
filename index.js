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
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages /*GatewayIntentBits.MessageContent*/,
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
    if (interaction.type === InteractionType.ApplicationCommandAutocomplete) {
      autocompleteController.router(interaction);
      return;
    } else if (interaction.isButton()) {
      buttonController.router(interaction);
      return;
    } else if (interaction.type === InteractionType.ApplicationCommand) {
      commandController.router(interaction, client);
      return;
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

        if (!msg.content.startsWith(defaultPrefix) || msg.author.bot) return;

        const args = msg.content.slice(defaultPrefix.length).trim().split(" ");
        const command = args.shift().toLowerCase();

        if (
          command === "lolistwalkers" ||
          command === "lowalkersearchbyname" ||
          command === "lowalkersearchbyowner" ||
          command === "lowalkersearchbylastuser" ||
          command === "skilltree" ||
          command === "learned" ||
          command === "loconfig" ||
          command === "linkserver" ||
          command === "loconfigupdate" ||
          command === "createtrade" ||
          command === "tradesearch" ||
          command === "lorecipe" ||
          command === "locraft" ||
          command === "lowalkerinfo" ||
          command === "walkersearch" ||
          command === "locommands" ||
          command === "lohelp" ||
          command === "loinfo"
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
