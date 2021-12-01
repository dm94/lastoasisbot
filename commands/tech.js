const commands = {};

const Discord = require("discord.js");
const itemsFunctions = require("../commands/items");
const othersFunctions = require("../helpers/others");

commands.getWhoHasLearntIt = async (channel, itemName, discordid) => {
  let allItems = await itemsFunctions.getAllItems();

  let item = allItems.find((it) => {
    return itemName.split(" ").every((internalItem) => {
      return it.name.toLowerCase().indexOf(internalItem.toLowerCase()) !== -1;
    });
  });

  if (item != null) {
    let tree = commands.getTechTree(allItems, item.name);
    if (tree != null) {
      const options = {
        method: "get",
        url: process.env.APP_API_URL + "/bot/" + discordid + "/tech",
        params: {
          tree: tree,
          tech: item.name,
        },
      };

      let response = await othersFunctions.apiRequest(options);
      if (response != null) {
        if (Array.isArray(response) && response.length > 0) {
          let message = new Discord.MessageEmbed()
            .setColor("#3A78EA")
            .setTitle(item.name)
            .setDescription("These are the people who have learned it")
            .setURL(
              "https://www.stiletto.live/item/" +
                encodeURI(item.name.toLowerCase())
            );
          let respondeLenght = response.length;
          for (let i = 0; i < respondeLenght; i++) {
            if (response[i].discordtag != null) {
              message.addField("Discord", response[i].discordtag, false);
            }
          }
          othersFunctions.sendChannelEmbed(channel, message);
        } else {
          othersFunctions.sendChannelMessage(
            channel,
            "There is no one from your clan with this learnt"
          );
        }
      } else {
        othersFunctions.sendChannelMessage(
          channel,
          "For this command to work the clan must be linked to this discord."
        );
      }
    }
  } else {
    othersFunctions.sendChannelMessage(
      channel,
      "We have not found any items with this name"
    );
  }
};

commands.addTech = async (channel, itemName, discordid) => {
  let allItems = await itemsFunctions.getAllItems();

  let item = allItems.find((it) => {
    return itemName.split(" ").every((internalItem) => {
      return it.name.toLowerCase().indexOf(internalItem.toLowerCase()) !== -1;
    });
  });

  if (item != null) {
    let tree = commands.getTechTree(allItems, item.name);
    if (tree != null) {
      const options = {
        method: "post",
        url: process.env.APP_API_URL + "/bot/" + discordid + "/tech",
        params: {
          tree: tree,
          tech: item.name,
        },
      };

      let response = await othersFunctions.apiRequest(options);
      if (response != null) {
        othersFunctions.sendChannelMessage(channel, "Learned: " + item.name);
      } else {
        othersFunctions.sendChannelMessage(channel, "An error has occurred");
      }
    }
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
