const commands = {};

const { EmbedBuilder } = require("discord.js");

const itemsFunctions = require("../commands/items");
const othersFunctions = require("../helpers/others");
const logger = require("../helpers/logger");

const WEBPAGE_URL = process.env.WEBPAGE_URL;

commands.getWhoHasLearntIt = async (interaction) => {
  await interaction.deferReply({ ephemeral: true });
  const itemName = interaction.options.getString("item").trim().toLowerCase();
  const discordid = interaction.guildId;

  const item = await itemsFunctions.getItem(itemName);

  if (item != null) {
    const tree = await itemsFunctions.getTechTree(item.name);
    const options = {
      method: "get",
      url: `${process.env.APP_API_URL}/bot/${discordid}/tech`,
      params: {
        tree: tree,
        tech: item.name,
      },
    };

    const response = await othersFunctions.apiRequest(options);
    if (response.success) {
      if (Array.isArray(response.data) && response.data.length > 0) {
        const message = new EmbedBuilder()
          .setColor("#3A78EA")
          .setTitle(item.name)
          .setDescription("These are the people who have learned it")
          .setURL(
            `${WEBPAGE_URL}/item/${encodeURI(item.name.toLowerCase())}`
          );
        const respondeLenght = response.data.length;
        const learnedList = [];
        for (let i = 0; i < respondeLenght; i++) {
          if (response.data[i].discordtag != null) {
            learnedList.push({
              name: "Discord",
              value: response.data[i].discordtag,
            });
          }
        }
        message.addFields(learnedList);
        await interaction
          .editReply({
            embeds: [message],
            ephemeral: false,
          })
          .catch((error) => logger.error(error));
      } else {
        await interaction
          .editReply({
            content: "There is no one from your clan with this learnt",
            ephemeral: true,
          })
          .catch((error) => logger.error(error));
      }
    } else {
      await interaction
        .editReply({
          content:
            "For this command to work the clan must be linked to this discord.",
          ephemeral: true,
        })
        .catch((error) => logger.error(error));
    }
  } else {
    await interaction
      .editReply({
        content: "We have not found any items with this name",
        ephemeral: true,
      })
      .catch((error) => logger.error(error));
  }
};

commands.addTech = async (interaction) => {
  await interaction.deferReply({ ephemeral: true });
  const itemName = interaction.options.getString("item").trim().toLowerCase();
  const discordid = interaction.member.id;

  const item = await itemsFunctions.getItem(itemName);

  if (item != null) {
    const tree = await itemsFunctions.getTechTree(item.name);
    const options = {
      method: "post",
      url: `${process.env.APP_API_URL}/bot/${discordid}/tech`,
      params: {
        tree: tree,
        tech: item.name,
      },
    };

    const response = await othersFunctions.apiRequest(options);
    if (response.success) {
      await interaction
        .editReply({
          content: `Added to the technology tree: ${item.name}`,
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
        content: "We have not found any items with this name",
        ephemeral: true,
      })
      .catch((error) => logger.error(error));
  }
};

module.exports = commands;
