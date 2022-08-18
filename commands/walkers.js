const walkerCommands = {};

require("dotenv").config();
const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");
const othersFunctions = require("../helpers/others");
const logger = require("../helpers/logger");

walkerCommands.walkerSearchWithParams = async (interaction, params) => {
  await interaction.deferReply();
  const options = {
    method: "get",
    url: process.env.APP_API_URL + "/bot/walkers",
    params: params,
  };

  let response = await othersFunctions.apiRequest(options);

  if (response.success) {
    if (response.data.length > 0) {
      let embeds = walkerCommands.getWalkersEmbed(response.data);
      await interaction
        .editReply({
          content: "Walker List",
          embeds: embeds,
        })
        .catch((error) => console.error(error));
    } else {
      await interaction
        .editReply({
          content: "No walker found",
        })
        .catch((error) => console.error(error));
    }
  } else {
    await interaction
      .editReply({
        content: response.data,
      })
      .catch((error) => console.error(error));
  }
};

walkerCommands.sendWalkerInfoFromID = async (
  interaction,
  walkerId,
  guildId
) => {
  walkerCommands.walkerSearchWithParams(interaction, {
    discordid: guildId,
    walkerid: walkerId,
  });
};

walkerCommands.getWalkersEmbed = (walkers) => {
  let embedList = [];
  walkers.forEach((walker) => {
    if (walker != null) {
      let date = new Date(walker.datelastuse);
      let embed = new EmbedBuilder().setColor("#58ACFA").setTitle(walker.name);
      let fields = [];
      fields.push({
        name: "Walker ID",
        value: walker.walkerID.toString(),
        inline: true,
      });
      fields.push({ name: "Last User", value: walker.lastUser, inline: true });
      fields.push({
        name: "Last use",
        value:
          date.getDate() +
          "-" +
          (parseInt(date.getMonth()) + 1) +
          "-" +
          date.getFullYear(),
        inline: true,
      });
      if (walker.ownerUser != null && walker.ownerUser) {
        fields.push({ name: "Owner", value: walker.ownerUser, inline: true });
      }
      if (walker.type != null && walker.type) {
        fields.push({ name: "Type", value: walker.type, inline: true });
      }
      if (walker.walker_use != null && walker.walker_use) {
        fields.push({ name: "Use", value: walker.walker_use, inline: true });
      }
      if (walker.description != null && walker.description) {
        fields.push({ name: "Description", value: walker.description });
      }
      if (walker.isReady != null && walker.isReady == "1") {
        fields.push({ name: "Ready", value: ":white_check_mark:" });
      } else {
        fields.push({ name: "Ready", value: ":x:" });
      }
      embed.addFields(fields);
      embedList.push(embed);
    }
  });
  if (embedList.length > 10) {
    embedList = embedList.splice(0, 10);
  }
  return embedList;
};

walkerCommands.setnotreadypvp = async (walkerid, msg) => {
  let params = {
    walkerid: walkerid,
    ready: 0,
  };

  walkerCommands.updateWalker(msg.guild.id, params);
};

walkerCommands.editWalker = async (interaction) => {
  await interaction.deferReply({ ephemeral: true });
  const options = {
    method: "put",
    url: process.env.APP_API_URL + "/bot/walkers/" + interaction.guildId,
    params: {
      walkerid: interaction.options.getInteger("walkerid"),
      ready: interaction.options.getBoolean("ready") ? 1 : 0,
    },
  };

  let response = await othersFunctions.apiRequest(options);
  if (response.success) {
    await interaction
      .editReply({
        content: "Walker updated",
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
};

walkerCommands.updateWalker = async (guildId, params) => {
  const options = {
    method: "put",
    url: process.env.APP_API_URL + "/bot/walkers/" + guildId,
    params: params,
  };

  let response = await othersFunctions.apiRequest(options);
  return response.success;
};

walkerCommands.insertNewWalker = (newWalker, discordid) => {
  const options = {
    method: "post",
    url: process.env.APP_API_URL + "/bot/walkers",
    params: {
      discordid: discordid,
      walkerid: newWalker.walkerID,
      name: newWalker.name,
      lastUser: newWalker.lastUser,
    },
  };

  othersFunctions.apiRequest(options);
};

walkerCommands.walkerAlarm = async (newWalker, msg) => {
  const options = {
    method: "get",
    url: process.env.APP_API_URL + "/bot/walkers",
    params: {
      discordid: msg.guild.id,
      walkerid: newWalker.walkerID,
    },
  };

  let response = await othersFunctions.apiRequest(options);

  if (response.success) {
    if (response.data.length > 0) {
      response.data.forEach((walker) => {
        if (
          !(walker.ownerUser == null || !walker.ownerUser) &&
          walker.ownerUser != newWalker.lastUser
        ) {
          othersFunctions.sendChannelMessage(
            msg.channel,
            "@everyone Alert the walker with owner has been used"
          );
        }
      });
    }
  }
};

walkerCommands.getWalkerListMessage = async (guildId) => {
  let message = new EmbedBuilder()
    .setColor("#58ACFA")
    .setTitle("Walker Ready List")
    .setTimestamp();

  const options = {
    method: "get",
    url: process.env.APP_API_URL + "/bot/walkers",
    params: {
      discordid: guildId,
      ready: 1,
      pageSize: 100,
    },
  };

  let response = await othersFunctions.apiRequest(options);

  if (response.success) {
    if (response.data.length > 0) {
      let fields = [];
      response.data.forEach((walker) => {
        let date = new Date(walker.datelastuse);
        let type = "Unknown";

        if (walker.type != null && walker.type) {
          type = walker.type;
        }
        fields.push({
          name: walker.name,
          value: `Type: ${type} - Last Use: ${
            date.getDate() +
            "-" +
            (parseInt(date.getMonth()) + 1) +
            "-" +
            date.getFullYear()
          } `,
        });
      });
      message.addFields(fields);
    } else {
      message.addFields({ name: "Walkers", value: "No walkers" });
    }
  } else {
    message.addFields({ name: "Walkers", value: "No walkers" });
  }

  return message;
};

walkerCommands.updateWalkerList = async (interaction) => {
  if (
    interaction.message &&
    interaction.message.createdTimestamp &&
    new Date().getTime() - interaction.message.createdTimestamp > 600000
  ) {
    let embed = await walkerCommands.getWalkerListMessage(interaction.guildId);
    interaction
      .editReply({
        content: "Can only be updated every 10 minutes",
        embeds: [embed],
      })
      .catch((error) => logger.error(error));
  }
};

walkerCommands.createWalkerList = async (interaction) => {
  await interaction.deferReply();
  let embed = await walkerCommands.getWalkerListMessage(interaction.guildId);

  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId("updateWalkerList")
      .setLabel("Update")
      .setStyle(ButtonStyle.Primary)
  );

  await interaction
    .editReply({
      content: "Can only be updated every 10 minutes",
      embeds: [embed],
      components: [row],
    })
    .catch((error) => logger.error(error));
};

module.exports = walkerCommands;
