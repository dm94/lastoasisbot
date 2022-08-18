const commands = {};

const { EmbedBuilder } = require("discord.js");

const othersFunctions = require("../helpers/others");
const itemsFunctions = require("../commands/items");
const logger = require("../helpers/logger");

commands.tradeSearchWithParams = async (interaction, params) => {
  await interaction.deferReply();
  const options = {
    method: "get",
    url: process.env.APP_API_URL + "/trades",
    params: params,
  };

  let response = await othersFunctions.apiRequest(options);

  if (response.success) {
    let embedList = [];
    if (Array.isArray(response.data)) {
      if (response.data.length < 1) {
        await interaction
          .editReply({
            content: "No trades with that filters",
          })
          .catch((error) => console.error(error));
        return;
      } else {
        response.data.forEach((trade) => {
          if (embedList.length < 10) {
            embedList.push(commands.getTradeInfo(trade));
          }
        });
        await interaction
          .editReply({
            content: "Trade List",
            embeds: embedList,
          })
          .catch((error) => console.error(error));
        return;
      }
    }
  } else {
    await interaction
      .editReply({
        content: response.data,
      })
      .catch((error) => console.error(error));
    return;
  }
  await interaction
    .editReply({
      content: "No trades with that filters",
    })
    .catch((error) => console.error(error));
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

commands.getTradeInfo = (trade) => {
  let message = new EmbedBuilder()
    .setColor("#FFE400")
    .setTitle(trade.type + " // " + trade.region);

  let fields = [];

  if (trade.resource != null) {
    fields.push({
      name: "Item",
      value: trade.resource,
      inline: false,
    });
  }

  if (trade.price != null && trade.price != 0) {
    fields.push({
      name: "Price in flots",
      value: trade.price.toString(),
      inline: true,
    });
  }
  if (trade.amount != null && trade.amount != 0) {
    fields.push({
      name: "Quantity",
      value: trade.amount.toString(),
      inline: true,
    });
  }
  if (trade.quality != null && trade.quality != 0) {
    fields.push({
      name: "Quality",
      value: trade.quality.toString(),
      inline: true,
    });
  }
  message.addFields(fields);
  message.setFooter({ text: "Discord: " + trade.discordtag });

  return message;
};

module.exports = commands;
