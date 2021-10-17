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

itemsCommands.lorecipe = async (msg, args, prefix) => {
  if (!args.length) {
    return msg.reply(
      "You have to add the recipe code. Example: " +
        prefix +
        "lorecipe 616b3570c66aaa1b355a8fd2"
    );
  }
  let code = msg.content.substr(msg.content.indexOf("lorecipe") + 8).trim();

  const options = {
    method: "get",
    url: process.env.APP_API_URL + "/recipes/" + code,
  };

  let response = await othersFunctions.apiRequest(options);
  if (response != null && response.items != null) {
    let allItems = JSON.parse(response.items);
    const items = await itemsCommands.getAllItems();
    allItems.forEach((item) => {
      let itemData = items.find(
        (data) => item.name != null && data.name === item.name
      );
      if (itemData) {
        setItemInfo(msg, itemData, item.count ? item.count : 1);
      }
    });
  }
};

async function getNecessaryMaterials(itemName, msg, multiplier) {
  if (itemName.length <= 0) {
    return;
  }
  let itemsSent = 0;

  const items = await itemsCommands.getAllItems();
  let itemsfilters = items.filter((item) =>
    item.name.toLowerCase().includes(itemName)
  );
  itemsfilters.forEach((item) => {
    if (itemsSent < 5) {
      itemsSent++;
      setItemInfo(msg, item, multiplier);
    }
  });
}

function setItemInfo(msg, item, multiplier) {
  let message = new Discord.MessageEmbed()
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
  othersFunctions.sendChannelMessage(msg, message);
}

itemsCommands.getAllItems = async () => {
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
};

module.exports = itemsCommands;
