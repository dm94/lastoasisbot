const genericCommands = {};

const { EmbedBuilder } = require("discord.js");
const pjson = require("../package.json");

genericCommands.getInfoContent = () => {
  const message = new EmbedBuilder()
    .setColor("#008FFF")
    .setTitle(pjson.name + " v" + pjson.version)
    .setURL("https://github.com/dm94/lastoasisbot")
    .setAuthor({
      name: "Dm94Dani",
      iconURL: "https://avatars.githubusercontent.com/u/7419213",
      url: "https://github.com/dm94",
    })
    .setDescription(
      "Discord Bot for Last Oasis" +
        "\nTo add the bot to your discord: https://discord.com/api/oauth2/authorize?client_id=715948052979908911&permissions=2147552256&scope=bot%20applications.commands" +
        "\nDm94Dani Discord: https://discord.gg/FcecRtZ"
    );
  return message;
};

genericCommands.getHelpContent = (commands) => {
  let text =
    "Now we work with slash commands type in chat / and you will start to see all the options \n \n";

  commands.forEach((command) => {
    if (command.name && command.description) {
      text += `**/${command.name}** = ${command.description} \n`;
    }
  });

  return text;
};

module.exports = genericCommands;
