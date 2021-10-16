const commands = {};

const Discord = require("discord.js");
const othersFunctions = require("../helpers/others");

commands.tradesearch = async (msg, prefix) => {
  let args = msg.content.slice(prefix.length).trim().split(" -");
  let page = 1;
  let params = {
    discordid: msg.author.id,
  };

  args.forEach((arg) => {
    if (arg.startsWith("page=")) {
      page = parseInt(arg.slice(6));
    } else if (arg.startsWith("type=")) {
      let data = arg.slice(5).trim().toLowerCase();
      if (data == "supply" || data == "demand") {
        params.type = data;
      }
    } else if (arg.startsWith("resource=")) {
      params.resource = arg.slice(9).trim();
    } else if (arg.startsWith("region=")) {
      params.region = arg.slice(7).trim();
    }
  });

  params.page = page;

  console.log(params);

  const options = {
    method: "get",
    url: process.env.APP_API_URL + "/trades",
    params: params,
  };

  let response = await othersFunctions.apiRequest(options);

  if (response != null && Array.isArray(response)) {
    if (response.length < 1) {
      othersFunctions.sendChannelMessage(msg, "No trades with that filters");
      return;
    }
    response.forEach((trade) => sentTradeinfo(msg, trade));
  } else {
    othersFunctions.sendChannelMessage(msg, "No trades with that filters");
  }
};

function sentTradeinfo(msg, trade) {
  let message = new Discord.MessageEmbed()
    .setColor("#FFE400")
    .setTitle(trade.type + " // " + trade.region);

  if (trade.price != null && trade.price != 0) {
    message.addField("Price in flots", trade.price, true);
  }
  if (trade.amount != null && trade.amount != 0) {
    message.addField("Quantity", trade.amount, true);
  }
  if (trade.quality != null && trade.quality != 0) {
    message.addField("Quality", trade.quality, true);
  }
  message.setFooter("Discord: " + trade.discordtag);

  othersFunctions.sendChannelMessage(msg, message);
}

module.exports = commands;
