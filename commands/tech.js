const commands = {};

const Discord = require("discord.js");
const Axios = require("axios");
const itemsFunctions = require("../commands/items");
const othersFunctions = require("../helpers/others");

commands.getWhoHasLearntIt = async (channel, itemName) => {
  let allItems = await itemsFunctions.getAllItems();
  let tree = "Vitamins";

  let item = allItems.find((it) => {
    return itemName.split(" ").every((internalItem) => {
      return it.name.toLowerCase().indexOf(internalItem.toLowerCase()) !== -1;
    });
  });

  if (item != null) {
    tree = commands.getTechTree(allItems, item.name);
    othersFunctions.sendChannelMessage(channel, "TechTree: " + tree);
  } else {
    othersFunctions.sendChannelMessage(
      channel,
      "We have not found any items with this name"
    );
  }
};

commands.getTechTree = (allItems, itemName) => {
  let item = allItems.find((it) => it.name === itemName);
  if (item) {
    if (item.parent) {
      return commands.getTechTree(allItems, item.parent);
    } else {
      return item.name;
    }
  } else {
    return itemName;
  }
};

module.exports = commands;
