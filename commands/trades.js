const commands = {};

const Discord = require("discord.js");
const othersFunctions = require("../helpers/others");
const itemsFunctions = require("../commands/items");

commands.tradesearch = async (msg, prefix) => {
  let args = msg.content.slice(prefix.length).trim().split(" -");
  let page = 1;
  let params = {
    discordid: msg.author.id,
  };

  args.forEach((arg) => {
    if (arg.startsWith("page=")) {
      try {
        page = parseInt(arg.slice(6));
      } catch (error) {}
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

  commands.tradeSearchWithParams(msg.channel, params);
};

commands.tradeSearchWithParams = async (channel, params) => {
  const options = {
    method: "get",
    url: process.env.APP_API_URL + "/trades",
    params: params,
  };

  let response = await othersFunctions.apiRequest(options);

  if (response != null && Array.isArray(response)) {
    if (response.length < 1) {
      othersFunctions.sendChannelMessage(
        channel,
        "No trades with that filters"
      );
      return;
    }
    response.forEach((trade) => sentTradeinfo(channel, trade));
  } else {
    othersFunctions.sendChannelMessage(channel, "No trades with that filters");
  }
};

commands.createtrade = async (msg, prefix) => {
  let args = msg.content.slice(prefix.length).trim().split(" -");

  if (args.length < 2) {
    othersFunctions.sendChannelMessage(
      msg.channel,
      "You have to add more data. Example: " +
        prefix +
        "createtrade -type=supply -region=eu -resource=bone splinter -quality=100 price=200"
    );
    return;
  }

  let allItems = await itemsFunctions.getAllItems();

  let params = {
    discordid: msg.author.id,
    type: "Supply",
    resource: "Aloe Vera",
    amount: 0,
    quality: 0,
    region: "eu",
    price: 0,
  };

  args.forEach((arg) => {
    let value = "";
    if (arg.startsWith("type=")) {
      value = arg.slice(5).trim().toLowerCase();
      if (value == "demand") {
        params.type = "Demand";
      } else {
        params.type = "Supply";
      }
    } else if (arg.startsWith("resource=")) {
      value = arg.slice(9).trim().toLowerCase();
      let item = allItems.find((item) => item.name.toLowerCase() == value);
      if (item) {
        params.resource = item.name;
      } else {
        othersFunctions.sendChannelMessage(
          msg.channel,
          "No resource with this name has been found"
        );
        return;
      }
    } else if (arg.startsWith("amount=")) {
      try {
        params.amount = parseInt(arg.slice(7).trim());
      } catch (e) {}
    } else if (arg.startsWith("region=")) {
      value = arg.slice(7).trim().toUpperCase();
      if (
        value == "EU" ||
        value == "NA" ||
        value == "OCE" ||
        value == "RUSSIA" ||
        value == "SA" ||
        value == "SEA"
      ) {
        params.region = value;
      }
    } else if (arg.startsWith("quality=")) {
      try {
        params.quality = parseInt(arg.slice(8).trim());
      } catch (e) {}
    } else if (arg.startsWith("price=")) {
      try {
        params.price = parseInt(arg.slice(6).trim());
      } catch (e) {}
    }
  });

  commands.createTradeWithParams(msg.channel, params);
};

commands.createTradeWithParams = async (channel, params) => {
  const options = {
    method: "post",
    url: process.env.APP_API_URL + "/bot/trades",
    params: params,
  };

  let response = await othersFunctions.apiRequest(options);
  if (response != null && response.Success != null) {
    othersFunctions.sendChannelMessage(channel, response.Success);
  } else {
    othersFunctions.sendChannelMessage(
      channel,
      "The trade could not be created, please try again."
    );
  }
};

function sentTradeinfo(channel, trade) {
  let message = new Discord.MessageEmbed()
    .setColor("#FFE400")
    .setTitle(trade.type + " // " + trade.region);

  if (trade.price != null && trade.price != 0) {
    message.addField("Price in flots", trade.price.toString(), true);
  }
  if (trade.amount != null && trade.amount != 0) {
    message.addField("Quantity", trade.amount.toString(), true);
  }
  if (trade.quality != null && trade.quality != 0) {
    message.addField("Quality", trade.quality.toString(), true);
  }
  message.setFooter("Discord: " + trade.discordtag);

  othersFunctions.sendChannelEmbed(channel, message);
}

module.exports = commands;
