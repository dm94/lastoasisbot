const itemsCommands = {};

const Discord = require("discord.js");
const Axios = require("axios");
const othersFunctions = require("../helpers/others");
let itemsLastCheck = 0;
let allItems = null;

itemsCommands.locraft = (msg, args, prefix) => {
  console.log(new Date() + " " + msg.content);
  if (!args.length) {
    return msg.reply(
      "You have to write what you want to craft and if you want the quantity to make. For more info write " +
        prefix +
        "locommands"
    );
  }
  let multiplier = 1;
  if (/(\d+)/.test(msg.content)) {
    multiplier = msg.content.match(/(\d+)/)[1];
  }
  let item = msg.content.substr(msg.content.indexOf("locraft") + 7);
  if (multiplier != 1) {
    item = msg.content.substr(msg.content.indexOf("x") + 1);
  }
  try {
    getNecessaryMaterials(item.trim().toLowerCase(), msg, multiplier);
  } catch (error) {
    console.log(error);
  }
};

async function getNecessaryMaterials(itemName, msg, multiplier) {
  if (itemName.length <= 0) {
    return;
  }
  var message = multiplier + "x " + itemName;
  let itemsSent = 0;

  const items = await getAllItems();
  let itemsfilters = items.filter((item) =>
    item.name.toLowerCase().includes(itemName)
  );
  itemsfilters.forEach((item) => {
    message = new Discord.MessageEmbed()
      .setColor("#FFE400")
      .setTitle(multiplier + "x " + item.name)
      .setDescription("Here are the necessary materials");
    let ingredie = item.crafting;
    if (ingredie != null) {
      for (var i = 0; i < ingredie.length; i++) {
        let le = ingredie[i].ingredients;
        for (var ing in le) {
          areItems = true;
          message.addField(le[ing].name, le[ing].count * multiplier, true);
        }
      }
    }
    if (item.cost != null) {
      message.setFooter("Cost: " + item.cost.count + " " + item.cost.name);
    }

    if (itemsSent < 5) {
      itemsSent++;
      othersFunctions.sendChannelMessage(msg, message);
    }
  });
}

function getAllItems() {
  if (allItems != null && itemsLastCheck >= Date.now() - 3600000) {
    return allItems;
  } else {
    return Axios.get(
      "https://raw.githubusercontent.com/dm94/stiletto-web/master/public/json/items_min.json"
    )
      .then((response) => {
        allItems = response.data;
        itemsLastCheck = Date.now();
        return allItems;
      })
      .catch((error) => {
        console.log(error);
      });
  }
}

module.exports = itemsCommands;
