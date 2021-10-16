const genericCommands = {};

const Discord = require("discord.js");
const othersFunctions = require("../helpers/others");
const pjson = require("../package.json");

genericCommands.loinfo = (msg) => {
  var message = new Discord.MessageEmbed()
    .setColor("#008FFF")
    .setTitle(pjson.name + " v" + pjson.version)
    .setURL("https://github.com/dm94/lastoasisbot")
    .setAuthor(
      "Dm94Dani",
      "https://comunidadgzone.es/wp-content/uploads/2020/08/FENIX-dm94dani.png",
      "https://github.com/dm94"
    )
    .setDescription(
      "Discord Bot for Last Oasis" +
        "\nTo add the bot to your discord: https://discordapp.com/oauth2/authorize?&client_id=715948052979908911&scope=bot&permissions=67584" +
        "\nDm94Dani Discord: https://discord.gg/FcecRtZ"
    );
  othersFunctions.sendChannelMessage(msg, message);
};

genericCommands.lohelp = (msg, prefix) => {
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
    "lolistwalkers (page) = Shows all the walkers added since this discord. Each page is 5 walkers (Obsolete) ```";
  messageEn +=
    "```" +
    prefix +
    "lowalkerinfo (id) = Shows the information of a specific walker```";
  messageEn +=
    "```" +
    prefix +
    "lowalkersearchbyname (name) = Shows all walkers with that name (Obsolete)```";
  messageEn +=
    "```" +
    prefix +
    "lowalkersearchbyowner (name) = Show all walkers with that owner (Obsolete)```";
  messageEn +=
    "```" +
    prefix +
    "lowalkersearchbylastuser (name) = Shows all the walkers that person has used (Obsolete)```";
  messageEn +=
    "```" +
    prefix +
    "walkersearch = To search for a walker or several walkers, has different filters: -page=, -name=, -owner=, -lastuser=, -ready, -pvp, -farming";
  messageEn +=
    "\n" +
    "An example of use: " +
    prefix +
    "walkersearch -page=1 -name=walker -ready -pvp";
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
    "tradesearch -page=1 -type=demand -type=cattail -region=eu";
  messageEn +=
    "\n" +
    "This will bring out all the walkers that are called walker are pvp and ready```";
  messageEn +=
    "```" +
    prefix +
    "loconfig = Shows all the info for the bot config (Only for admins)```";
  othersFunctions.sendChannelMessage(msg, messageEn);
};

module.exports = genericCommands;
