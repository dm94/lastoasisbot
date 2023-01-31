const clanCommands = {};

const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");
require("dotenv").config();
const othersFunctions = require("../helpers/others");
const logger = require("../helpers/logger");

clanCommands.kickMember = async (msg, user) => {
  const discordid = msg.guild.id;

  if (discordid != null) {
    const options = {
      method: "delete",
      url: process.env.APP_API_URL + "/bot/clans/" + discordid,
      params: {
        nick: user,
      },
    };

    const response = await othersFunctions.apiRequest(options);

    if (response.success) {
      othersFunctions.sendChannelMessage(msg.channel, "Member kicked");
    } else {
      othersFunctions.sendChannelMessage(msg.channel, response.data);
    }
  }
};

clanCommands.linkserver = async (interaction) => {
  await interaction.deferReply({ ephemeral: true });
  const serverid = interaction.guildId;
  const memberid = interaction.member.id;

  if (serverid != null && memberid != null) {
    const options = {
      method: "post",
      url: process.env.APP_API_URL + "/bot/clans/" + serverid,
      params: {
        memberid: memberid,
      },
    };

    const response = await othersFunctions.apiRequest(options);

    if (response.success) {
      await interaction
        .editReply({
          content: "Linked server",
          ephemeral: true,
        })
        .catch((error) => logger.error(error));
    } else {
      await interaction
        .editReply({
          content:
            "Could not link server. Remember that you have to be the clan leader or have permission to manage the bot in the clan.",
          ephemeral: true,
        })
        .catch((error) => logger.error(error));
    }
  }
};

clanCommands.createDiplomacyList = async (interaction) => {
  await interaction.deferReply();
  let diplomacyType = "1";

  if (interaction.commandName === "createsettlerslist") {
    diplomacyType = "0";
  } else if (interaction.commandName === "createenemylist") {
    diplomacyType = "2";
  }

  const message = await clanCommands.getDiplomacyListMessage(
    interaction.guildId,
    diplomacyType
  );

  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId("updateDiplomacyList-" + diplomacyType)
      .setLabel("Update")
      .setStyle(ButtonStyle.Primary)
  );

  message.components = [row];

  await interaction.editReply(message).catch((error) => logger.error(error));
};

clanCommands.updateDiplomacyList = async (interaction) => {
  if (
    interaction.message &&
    interaction.message.createdTimestamp &&
    new Date().getTime() - interaction.message.createdTimestamp > 600000
  ) {
    let diplomacyType = "1";
    if (interaction.customId.includes("-0")) {
      diplomacyType = "0";
    } else if (interaction.customId.includes("-1")) {
      diplomacyType = "1";
    } else if (interaction.customId.includes("-2")) {
      diplomacyType = "2";
    }

    const message = await clanCommands.getDiplomacyListMessage(
      interaction.guildId,
      diplomacyType
    );
    interaction.editReply(message).catch((error) => logger.error(error));
  }
};

clanCommands.getDiplomacyListMessage = async (guildId, type) => {
  const message = {
    content: "Can only be updated every 10 minutes",
  };
  const embedsList = [];

  if (!guildId) {
    return "";
  }

  let title = "Diplomacy";
  let color = "#58ACFA";

  switch (type) {
    case "1":
      title = "Allies";
      color = "#00bc8c";
      break;
    case "0":
      title = "NAP or Settlers";
      color = "#f39c12";
      break;
    case "2":
      title = "Enemies";
      color = "#e74c3c";
      break;
  }

  embedsList.push(
    new EmbedBuilder().setColor(color).setTitle(title).setTimestamp()
  );

  const options = {
    method: "get",
    url: `${process.env.APP_API_URL}/bot/${guildId}/relationships`,
  };

  const response = await othersFunctions.apiRequest(options);

  if (response.success) {
    if (response.data.length > 0) {
      const diplomacyList = response.data.filter((d) => d.typed == type);

      const extraClans = [];

      diplomacyList.forEach((clan, index) => {
        const name = clan.name ? clan.name : "Clan";
        const flagcolor = clan.flagcolor ? clan.flagcolor : "#000";
        const symbol = clan.symbol ? clan.symbol : "C1";

        if (index > 7) {
          extraClans.push(name);
        } else {
          embedsList.push(
            new EmbedBuilder().setColor(flagcolor).setAuthor({
              name: name,
              iconURL: `https://resources.stiletto.live/symbols/${symbol}.png`,
            })
          );
        }
      });
      if (extraClans.length > 0) {
        const extraEmbed = new EmbedBuilder()
          .setColor(color)
          .setTitle("More clans");
        let embedText = "";
        extraClans.forEach((clan) => {
          embedText = embedText + clan + "\n";
        });
        extraEmbed.setDescription(embedText);
        embedsList.push(extraEmbed);
      }
    } else {
      embedsList.push(
        new EmbedBuilder()
          .setColor(color)
          .setTitle(
            "Diplomacy is empty. You can manage it from here: https://www.stiletto.live/diplomacy"
          )
      );
    }
  } else {
    embedsList.push(
      new EmbedBuilder()
        .setColor(color)
        .setTitle(
          "Diplomacy is empty. You can manage it from here: https://www.stiletto.live/diplomacy"
        )
    );
  }

  message.embeds = embedsList;

  return message;
};

module.exports = clanCommands;
