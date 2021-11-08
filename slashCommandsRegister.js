require("dotenv").config();
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const fs = require("fs");
const controller = {};

const commands = [];
const commandFiles = fs
  .readdirSync("./commands/slashcommands")
  .filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
  const command = require(`./commands/slashcommands/${file}`);
  commands.push(command.data.toJSON());
}

const rest = new REST({ version: "9" }).setToken(process.env.DISCORD_TOKEN);

controller.registerSlashCommandsGlobal = async () => {
  try {
    console.log("Started refreshing application (/) commands.");

    await rest.put(Routes.applicationCommands(process.env.DISCORD_CLIENT_ID), {
      body: commands,
    });

    console.log("Successfully reloaded application (/) commands.");
  } catch (error) {
    console.log(error);
  }
};

controller.registerSlashCommands = async (guildId) => {
  try {
    if (guildId) {
      console.log("Started refreshing application (/) commands.");

      await rest.put(
        Routes.applicationGuildCommands(process.env.DISCORD_CLIENT_ID, guildId),
        {
          body: commands,
        }
      );

      console.log("Successfully reloaded application (/) commands.");
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = controller;
