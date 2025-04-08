const itemsCommands = {};

const { EmbedBuilder } = require("discord.js");
const Axios = require("axios");

const logger = require("../helpers/logger");
const othersFunctions = require("../helpers/others");
let itemsLastCheck = 0;
let allItems = null;

const WEBPAGE_URL = process.env.WEBPAGE_URL;
const STATIC_RESOURCES_URL = process.env.STATIC_RESOURCES_URL;

itemsCommands.sendRecipe = async (interaction, code) => {
  await interaction.deferReply();
  const options = {
    method: "get",
    url: `${process.env.APP_API_URL}/recipes/${code}`,
  };

  const response = await othersFunctions.apiRequest(options);
  if (response.success) {
    if (response.data.items != null) {
      const itemsResponse = JSON.parse(response.data.items);
      const items = await itemsCommands.getAllItems();
      const embedList = [];
      itemsResponse.forEach((item) => {
        const itemData = items.find(
          (data) => item.name != null && data.name === item.name
        );
        if (itemData) {
          if (embedList.length < 10) {
            embedList.push(
              itemsCommands.getItemInfo(itemData, item.count ? item.count : 1)
            );
          }
        }
      });
      await interaction
        .editReply({
          embeds: embedList,
        })
        .catch((error) => logger.error(error));
    } else {
      await interaction
        .editReply({
          content: "No items found",
        })
        .catch((error) => logger.error(error));
    }
  } else {
    await interaction
      .editReply({
        content: response.data,
      })
      .catch((error) => logger.error(error));
  }
};

itemsCommands.getNecessaryMaterials = async (
  interaction,
  itemName,
  multiplier
) => {
  await interaction.deferReply();
  if (itemName.length <= 0) {
    return;
  }
  if (!multiplier) {
    multiplier = 1;
  }
  const items = await itemsCommands.getAllItems();
  let itemsfilters = items.filter((it) => {
    return itemName.split(" ").every((internalItem) => {
      return it.name.toLowerCase().includes(internalItem.toLowerCase());
    });
  });
  if (itemsfilters.length < 1) {
    itemsfilters = items.filter((it) => {
      return itemName.split(" ").some((internalItem) => {
        return it.name.toLowerCase().includes(internalItem.toLowerCase());
      });
    });
  }

  if (itemsfilters.length > 0) {
    const embedList = [];
    itemsfilters.forEach((item) => {
      if (embedList.length < 10) {
        embedList.push(itemsCommands.getItemInfo(item, multiplier));
      }
    });
    await interaction
      .editReply({
        embeds: embedList,
      })
      .catch((error) => logger.error(error));
  } else {
    await interaction
      .editReply({
        content: "No items found",
      })
      .catch((error) => logger.error(error));
  }
};

itemsCommands.getItemInfo = (item, multiplier) => {
  let name = item.name;
  if (name.includes("Tier 1")) {
    name = "Walker Upgrade Wood";
  } else if (name.includes("Tier 2")) {
    name = "Walker Upgrade Bone";
  } else if (name.includes("Tier 3")) {
    name = "Walker Upgrade Ceramic";
  } else if (name.includes("Tier 4")) {
    name = "Walker Upgrade Iron";
  } else if (name.includes("Wings Small")) {
    name = "Walker Wings Small";
  } else if (name.includes("Wings Medium")) {
    name = "Walker Wings Medium";
  } else if (name.includes("Wings Large")) {
    name = "Walker Wings Large";
  } else if (name.includes("Wings Skirmish")) {
    name = "Walker Wings Skirmish";
  } else if (name.includes("Wings Raider")) {
    name = "Walker Wings Raider";
  } else if (name.includes("Wings Heavy")) {
    name = "Walker Wings Heavy";
  } else if (name.includes("Wings Rugged")) {
    name = "Walker Wings Rugged";
  } else if (name.includes(" Wings")) {
    name = "Walker Wings";
  } else if (name.includes("Legs Armored")) {
    name = "Walker Legs Armored";
  } else if (name.includes("Legs Heavy")) {
    name = "Walker Legs Heavy";
  } else if (name.includes("Legs")) {
    name = "Walker Legs";
  } else if (name.includes("Grappling Hook")) {
    name = "Grappling Hook";
  }
  name = name.replaceAll("Body", "");

  const message = new EmbedBuilder()
    .setColor("#FFE400")
    .setTitle(`${multiplier}x ${item.name}`)
    .setDescription("Here are the necessary materials")
    .setURL(
      `${WEBPAGE_URL}/item/${encodeURI(item.name.toLowerCase())}`
    )
    .setThumbnail(
      `${STATIC_RESOURCES_URL}/items/${encodeURI(`${name.trim()} icon.png`)}`
    );
  const ingredie = item.crafting;
  if (ingredie != null) {
    const allIngrediends = [];
    const ingredientLength = ingredie.length;
    for (let i = 0; i < ingredientLength; i++) {
      const output = ingredie[i].output != null ? ingredie[i].output : 1;
      const le = ingredie[i].ingredients;
      for (const ing in le) {
        allIngrediends.push({
          name: le[ing].name,
          value: ((le[ing].count / output) * multiplier).toString(),
          inline: true,
        });
      }
    }
    message.addFields(allIngrediends);
  }
  if (item.cost != null) {
    message.setFooter({
      text: `Cost: ${item.cost.count} ${item.cost.name}`,
    });
  }
  return message;
};

itemsCommands.getAllItems = async () => {
  if (allItems != null && itemsLastCheck >= Date.now() - 3600000) {
    return allItems;
  }

  return Axios.get(
    "https://raw.githubusercontent.com/dm94/stiletto-web/master/public/json/items_min.json"
  )
    .then((response) => {
      allItems = response.data;
      allItems = allItems.filter((it) => it.crafting);
      itemsLastCheck = Date.now();
      return allItems;
    })
    .catch((error) => {
      logger.error(error);
    });
};

itemsCommands.getItem = async (itemName) => {
  if (allItems == null) {
    allItems = await itemsCommands.getAllItems();
  }
  return allItems.find((it) => {
    return itemName.split(" ").every((internalItem) => {
      return it.name.toLowerCase().includes(internalItem.toLowerCase());
    });
  });
};

itemsCommands.getTechTree = async (itemName) => {
  if (allItems == null) {
    allItems = await itemsCommands.getAllItems();
  }
  const item = allItems.find((it) => it.name === itemName);
  if (item) {
    if (item.parent) {
      return await itemsCommands.getTechTree(item.parent);
    }
    return item.name;
  }

  return itemName;
};

module.exports = itemsCommands;
