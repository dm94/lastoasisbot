const commands = {};

const Discord = require("discord.js");
const othersFunctions = require("../helpers/others");
const itemsFunctions = require("../commands/items");
const logger = require("../helpers/logger");

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

  if (response.success) {
    if (Array.isArray(response.data)) {
      if (response.data.length < 1) {
        othersFunctions.sendChannelMessage(
          channel,
          "No trades with that filters"
        );
        return;
      }
      response.data.forEach((trade) => sentTradeinfo(channel, trade));
    }
  } else {
    othersFunctions.sendChannelMessage(channel, response.data);
  }
};

commands.createtrade = async (interaction) => {
  await interaction.deferReply({ ephemeral: true });
  let params = {
    discordid: interaction.member.id,
    type: "Supply",
    resource: "Aloe Vera",
    amount: 0,
    quality: 0,
    region: "eu",
    price: 0,
  };
  let allItems = await itemsFunctions.getAllItems();
  let resourceName = interaction.options.getString("resource").toLowerCase();
  let item = allItems.find((it) => it.name.toLowerCase() == resourceName);
  if (item) {
    params.resource = item.name;
    params.region = interaction.options.getString("region")
      ? interaction.options.getString("region").trim()
      : "EU";
    params.type = interaction.options.getString("type")
      ? interaction.options.getString("type").trim()
      : "Supply";
    params.amount = interaction.options.getInteger("amount")
      ? interaction.options.getInteger("amount")
      : 0;
    params.quality = interaction.options.getInteger("quality")
      ? interaction.options.getInteger("quality")
      : 0;
    params.price = interaction.options.getInteger("price")
      ? interaction.options.getInteger("price")
      : 0;

    const options = {
      method: "post",
      url: process.env.APP_API_URL + "/bot/trades",
      params: params,
    };

    let response = await othersFunctions.apiRequest(options);
    if (response.success) {
      await interaction
        .editReply({
          content: "Trade Created",
          ephemeral: true,
        })
        .catch((error) => logger.error(error));
    } else {
      await interaction
        .editReply({
          content: response.data,
          ephemeral: true,
        })
        .catch((error) => logger.error(error));
    }
  } else {
    await interaction
      .editReply({
        content: "No resource with this name has been found",
        ephemeral: true,
      })
      .catch((error) => logger.error(error));
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
  message.setFooter({ text: "Discord: " + trade.discordtag });

  othersFunctions.sendChannelEmbed(channel, message);
}

module.exports = commands;
