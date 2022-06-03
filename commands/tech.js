const commands = {};

const Discord = require("discord.js");
const itemsFunctions = require("../commands/items");
const othersFunctions = require("../helpers/others");

commands.getWhoHasLearntIt = async (interaction) => {
  await interaction.deferReply({ ephemeral: true });
  let itemName = interaction.options.getString("item").trim().toLowerCase();
  let discordid = interaction.guildId;

  let item = await itemsFunctions.getItem(itemName);

  if (item != null) {
    let tree = itemsFunctions.getTechTree(item.name);
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
      if (response.success) {
        if (Array.isArray(response.data) && response.data.length > 0) {
          let message = new Discord.MessageEmbed()
            .setColor("#3A78EA")
            .setTitle(item.name)
            .setDescription("These are the people who have learned it")
            .setURL(
              "https://www.stiletto.live/item/" +
                encodeURI(item.name.toLowerCase())
            );
          let respondeLenght = response.data.length;
          for (let i = 0; i < respondeLenght; i++) {
            if (response.data[i].discordtag != null) {
              message.addField("Discord", response.data[i].discordtag, false);
            }
          }
          await interaction.editReply({
            content: message,
            ephemeral: true,
          });
        } else {
          await interaction.editReply({
            content: "There is no one from your clan with this learnt",
            ephemeral: true,
          });
        }
      } else {
        await interaction.editReply({
          content:
            "For this command to work the clan must be linked to this discord.",
          ephemeral: true,
        });
      }
    }
  } else {
    await interaction.editReply({
      content: "We have not found any items with this name",
      ephemeral: true,
    });
  }
};

commands.addTech = async (interaction) => {
  await interaction.deferReply({ ephemeral: true });
  let itemName = interaction.options.getString("item").trim().toLowerCase();
  let discordid = interaction.member.id;

  let item = await itemsFunctions.getItem(itemName);

  if (item != null) {
    let tree = itemsFunctions.getTechTree(item.name);
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
      if (response.success) {
        await interaction.editReply({
          content: "Added to the technology tree: " + item.name,
          ephemeral: true,
        });
      } else {
        await interaction.editReply({
          content: response.data,
          ephemeral: true,
        });
      }
    }
  } else {
    await interaction.editReply({
      content: "We have not found any items with this name",
      ephemeral: true,
    });
  }
};

module.exports = commands;
