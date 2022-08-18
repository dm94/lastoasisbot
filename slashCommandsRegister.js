require("dotenv").config();
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const fs = require("fs");
const controller = {};
const logger = require("./helpers/logger");

const commands = [];
const commandFiles = fs
  .readdirSync("./commands/slashcommands")
  .filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
  const command = require(`./commands/slashcommands/${file}`);
  console.info("/" + command.data.name + " = " + command.data.description);
  commands.push(command.data.toJSON());
}

const rest = new REST({ version: "9" }).setToken(process.env.DISCORD_TOKEN);

controller.registerSlashCommandsGlobal = async () => {
  try {
    await rest.put(Routes.applicationCommands(process.env.DISCORD_CLIENT_ID), {
      body: commands,
    });
  } catch (error) {
    logger.error(error);
  }
};

controller.registerSlashCommands = async (guildId) => {
  try {
    if (guildId) {
      await rest.put(
        Routes.applicationGuildCommands(process.env.DISCORD_CLIENT_ID, guildId),
        {
          body: commands,
        }
      );
    }
  } catch (error) {
    logger.error(error);
  }
};

module.exports = controller;
