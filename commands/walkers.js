const walkerCommands = {};

require("dotenv").config();
const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const othersFunctions = require("../helpers/others");

walkerCommands.walkersearch = async (msg, prefix) => {
  let args = msg.content.slice(prefix.length).trim().split(" -");
  let page = 1;
  let params = {
    discordid: msg.guild.id,
  };

  args.forEach((arg) => {
    if (arg.startsWith("page=")) {
      try {
        page = parseInt(arg.slice(6));
      } catch (error) {}
    } else if (arg.startsWith("name=")) {
      params.name = arg.slice(6).trim();
    } else if (arg.startsWith("owner=")) {
      params.owner = arg.slice(7).trim();
    } else if (arg.startsWith("lastuser=")) {
      params.lastuser = arg.slice(10).trim();
    } else if (arg.startsWith("desc=")) {
      params.desc = arg.slice(6).trim();
    } else if (arg.startsWith("type=")) {
      params.type = arg.slice(6).trim();
    } else if (arg.startsWith("ready")) {
      params.ready = 1;
    } else if (arg.startsWith("pvp")) {
      params.use = "pvp";
    } else if (arg.startsWith("farming")) {
      params.use = "farming";
    }
  });

  params.page = page;

  walkerCommands.walkerSearchWithParams(msg.channel, params);
};

walkerCommands.walkerSearchWithParams = async (channel, params) => {
  const options = {
    method: "get",
    url: process.env.APP_API_URL + "/bot/walkers",
    params: params,
  };

  let response = await othersFunctions.apiRequest(options);

  if (response.success) {
    if (response.data.length > 0) {
      let embeds = walkerCommands.getWalkersEmbed(response.data);
      othersFunctions.sendChannelData(channel, { embeds: embeds });
    } else {
      othersFunctions.sendChannelMessage(channel, "No walker found");
    }
  } else {
    othersFunctions.sendChannelMessage(channel, response.data);
  }
};

walkerCommands.lowalkerinfo = async (msg, args, prefix) => {
  if (args.length != 1) {
    msg.reply(
      "To view the information of a walker write " +
        prefix +
        "lowalkerinfo id \n```Example: " +
        prefix +
        "lowalkerinfo 721480717```"
    );
  } else {
    let walkerId = 0;
    try {
      walkerId = parseInt(args[0]);
    } catch (error) {}

    walkerCommands.sendWalkerInfoFromID(msg.channel, walkerId, msg.guild.id);
  }
};

walkerCommands.sendWalkerInfoFromID = async (channel, walkerId, guildId) => {
  walkerCommands.walkerSearchWithParams(channel, {
    discordid: guildId,
    walkerid: walkerId,
  });
};

walkerCommands.getWalkersEmbed = (walkers) => {
  let embedList = [];
  walkers.forEach((walker) => {
    if (walker != null) {
      let date = new Date(walker.datelastuse);
      let embed = new MessageEmbed().setColor("#58ACFA").setTitle(walker.name);
      embed.addField("Walker ID", walker.walkerID.toString(), true);
      embed.addField("Last User", walker.lastUser, true);
      embed.addField(
        "Last use",
        date.getDate() +
          "-" +
          (parseInt(date.getMonth()) + 1) +
          "-" +
          date.getFullYear(),
        true
      );
      if (walker.ownerUser != null && walker.ownerUser) {
        embed.addField("Owner", walker.ownerUser, true);
      }
      if (walker.type != null && walker.type) {
        embed.addField("Type", walker.type, true);
      }
      if (walker.walker_use != null && walker.walker_use) {
        embed.addField("Use", walker.walker_use, true);
      }
      if (walker.description != null && walker.description) {
        embed.addField("Description", walker.description);
      }
      if (walker.isReady != null && walker.isReady == "1") {
        embed.addField("Ready", ":white_check_mark:");
      } else {
        embed.addField("Ready", ":x:");
      }
      embedList.push(embed);
    }
  });
  return embedList;
};

walkerCommands.sendWalkerInfo = (channel, walker) => {
  if (walker != null) {
    let date = new Date(walker.datelastuse);
    let message = new MessageEmbed().setColor("#58ACFA").setTitle(walker.name);
    message.addField("Walker ID", walker.walkerID.toString(), true);
    message.addField("Last User", walker.lastUser, true);
    message.addField(
      "Last use",
      date.getDate() +
        "-" +
        (parseInt(date.getMonth()) + 1) +
        "-" +
        date.getFullYear(),
      true
    );
    if (walker.ownerUser != null && walker.ownerUser) {
      message.addField("Owner", walker.ownerUser, true);
    }
    if (walker.type != null && walker.type) {
      message.addField("Type", walker.type, true);
    }
    if (walker.walker_use != null && walker.walker_use) {
      message.addField("Use", walker.walker_use, true);
    }
    if (walker.description != null && walker.description) {
      message.addField("Description", walker.description);
    }
    if (walker.isReady != null && walker.isReady == "1") {
      message.addField("Ready", ":white_check_mark:");
    } else {
      message.addField("Ready", ":x:");
    }
    othersFunctions.sendChannelEmbed(channel, message);
  }
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
    await interaction.editReply({
      content: "Walker updated",
      ephemeral: true,
    });
  } else {
    await interaction.editReply({
      content: response.data,
      ephemeral: true,
    });
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
  let embedsList = [];

  embedsList.push(
    new MessageEmbed()
      .setColor("#58ACFA")
      .setTitle("Walker Ready List")
      .setTimestamp()
  );

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
      let embeds = walkerCommands.getWalkersEmbed(response.data);
      embedsList = embedsList.concat(embeds);
    } else {
      embedsList.push(
        new MessageEmbed().setColor("#f39c12").setTitle("No walkers")
      );
    }
  } else {
    embedsList.push(
      new MessageEmbed().setColor("#f39c12").setTitle("No walkers")
    );
  }

  return embedsList;
};

walkerCommands.updateWalkerList = async (interaction) => {
  if (
    interaction.message &&
    interaction.message.createdTimestamp &&
    new Date().getTime() - interaction.message.createdTimestamp > 600000
  ) {
    let embeds = await walkerCommands.getWalkerListMessage(interaction.guildId);
    interaction.editReply({
      content: "Can only be updated every 10 minutes",
      embeds: embeds,
    });
  }
};

walkerCommands.createWalkerList = async (interaction) => {
  await interaction.deferReply();
  let embeds = await walkerCommands.getWalkerListMessage(interaction.guildId);

  const row = new MessageActionRow().addComponents(
    new MessageButton()
      .setCustomId("updateWalkerList")
      .setLabel("Update")
      .setStyle("PRIMARY")
  );

  await interaction
    .editReply({
      content: "Can only be updated every 10 minutes",
      embeds: embeds,
      components: [row],
    })
    .catch(console.error);
};

module.exports = walkerCommands;
