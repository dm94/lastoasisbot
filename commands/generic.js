const genericCommands = {};

const { MessageEmbed } = require("discord.js");
const othersFunctions = require("../helpers/others");
const pjson = require("../package.json");

genericCommands.loinfo = (msg) => {
  othersFunctions.sendChannelEmbed(
    msg.channel,
    genericCommands.getInfoContent()
  );
};

genericCommands.lohelp = (msg, prefix) => {
  othersFunctions.sendChannelMessage(
    msg.channel,
    genericCommands.getHelpContent(prefix)
  );
};

genericCommands.getInfoContent = () => {
  let message = new MessageEmbed()
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

genericCommands.obsoleteCommand = (msg) => {
  let message =
    "``` This command is obsolete and no longer works. Use the slash commands with /. \n Example: /lohelp \n If you do not see these commands talk to Dm94Dani#6385 ```";
  othersFunctions.sendChannelMessage(msg.channel, message);
};

genericCommands.getHelpContent = (prefix) => {
  let messageEn =
    "```" +
    prefix +
    "locraft = With this command you can see the materials needed to make an object. \nExample of use: " +
    prefix +
    "locraft Barrier Base \nIf you want to see the materials to make 10: " +
    prefix +
    "locraft 10x Barrier Base ```";
  messageEn += "```" + prefix + "loinfo = Displays bot information. ```";
  messageEn +=
    "```" +
    prefix +
    "lorecipe (code) = Displays the list of recipes for that code```";
  messageEn +=
    "```" +
    prefix +
    "lowalkerinfo (id) = Shows the information of a specific walker```";
  messageEn +=
    "```" +
    prefix +
    "walkersearch = To search for a walker or several walkers, has different filters: -page=, -name=, -owner=, -lastuser=, -ready, -pvp, -farming, -desc, -type";
  messageEn +=
    "\n" +
    "An example of use: " +
    prefix +
    "walkersearch -page=1 -name=walker -type=falco -ready -pvp";
  messageEn +=
    "\n" +
    "This will bring out all the walkers that are called walker are pvp and ready```";
  messageEn +=
    "```" +
    prefix +
    "tradesearch = To perform a search for trades, has different filters: -page=, -type=, -resource=, -region=";
  messageEn +=
    "\n" +
    "An example of use: " +
    prefix +
    "tradesearch -page=1 -type=demand -type=cattail -region=eu```";
  messageEn +=
    "```" +
    prefix +
    "createtrade = To create a trade, has different parameters: -type=Supply|Demand, -resource=, -region=EU|NA|OCE|RUSSIA|SEA|SA, -quality, -price, -amount";
  messageEn +=
    "\n" +
    "An example of use: " +
    prefix +
    "createtrade -type=supply -region=eu -resource=bone splinter -quality=100 price=200```";
  return messageEn;
};

module.exports = genericCommands;
