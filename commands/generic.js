const genericCommands = {};

const { EmbedBuilder } = require("discord.js");
const othersFunctions = require("../helpers/others");
const pjson = require("../package.json");

genericCommands.getInfoContent = () => {
  let message = new EmbedBuilder()
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

genericCommands.getHelpContent = () => {
  return `
  Now we work with slash commands type in chat / and you will start to see all the options

  /config = Shows all the info for the bot config (Only for admins or members with permissions)
  /configupdate = To update the bot configuration (Only for admins or members with permissions)
  /craft = With this command you can see the materials needed to make an item
  /createalliancelist = Create a list of allied clans. (Only for admins or members with permissions)
  /createenemylist = Create a list of enemy clans. (Only for admins or members with permissions)
  /createsettlerslist = Generate a list of clans that are settlers or NAPs. (Only for admins or members with permissions)
  /createtrade = To create a trade, has different parameters
  /createwalkerlist = Generates a list of clan walkers that are ready. (Only for admins or members with permissions)
  /editwalker = Edit the walker you want (Only for admins or members with permissions)
  /learned = Add the item to the list of learned items
  /linkserver = Link the discord server to the clan you are in. (Only for admins)
  /lohelp = Replies with commands info
  /loinfo = Bot info
  /recipe = Displays the list of recipes for that code
  /skilltree = Tells you who in your clan has learned that item.
  /tradesearch = To perform a search for trades, has different filters
  /vote = Information for voting and helping the bot
  /walkerinfo = Shows the information of a specific walker
  /walkersearch = To search for a walker or several walkers, has different filters`;
};

module.exports = genericCommands;
