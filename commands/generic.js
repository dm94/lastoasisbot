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
  let messageEn = ":flag_gb: \n```";
  messageEn +=
    prefix +
    "locraft = With this command you can see the materials needed to make an object. \nExample of use: " +
    prefix +
    "locraft Barrier Base \nIf you want to see the materials to make 10: " +
    prefix +
    "locraft 10x Barrier Base ";
  messageEn += "\n" + prefix + "loinfo = Displays bot information.";
  messageEn +=
    "\n" +
    prefix +
    "lolistwalkers (page) = Shows all the walkers added since this discord. Each page is 5 walkers";
  messageEn +=
    "\n" +
    prefix +
    "lowalkerinfo (id) = Shows the information of a specific walker";
  messageEn +=
    "\n" +
    prefix +
    "lowalkersearchbyname (name) = Shows all walkers with that name";
  messageEn +=
    "\n" +
    prefix +
    "lowalkersearchbyowner (name) = Show all walkers with that owner";
  messageEn +=
    "\n" +
    prefix +
    "lowalkersearchbylastuser (name) = Shows all the walkers that person has used";
  messageEn += "```";
  othersFunctions.sendChannelMessage(msg, messageEn);
};

module.exports = genericCommands;
