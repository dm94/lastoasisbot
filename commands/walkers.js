const walkerCommands = {};

require("dotenv").config();
const Discord = require("discord.js");
const othersFunctions = require("../helpers/others");

walkerCommands.lolistwalkers = async (msg) => {
  let page = 1;
  if (/(\s\d+)/.test(msg.content)) {
    page = msg.content.match(/(\s\d+)/)[1];
  }
  const options = {
    method: "get",
    url: process.env.APP_API_URL + "/bot/walkers",
    params: {
      discordid: msg.guild.id,
      page: page,
    },
    headers: {
      apiKey: process.env.APP_API_KEY,
    },
  };

  let response = await othersFunctions.apiRequest(options);

  if (response != null && response.length > 0) {
    response.forEach((walker) => {
      walkerCommands.sendWalkerInfo(msg, walker);
    });
  } else {
    othersFunctions.sendChannelMessage(msg, "No walker found");
  }
};

walkerCommands.lowalkersearchbyname = async (msg) => {
  let page = 1;
  if (/(\s\d+)/.test(msg.content)) {
    page = msg.content.match(/(\s\d+)/)[1];
  }
  let name = msg.content
    .substring(msg.content.indexOf("lowalkersearchbyname") + 20)
    .trim();

  const options = {
    method: "get",
    url: process.env.APP_API_URL + "/bot/walkers",
    params: {
      discordid: msg.guild.id,
      name: name,
      page: page,
    },
    headers: {
      apiKey: process.env.APP_API_KEY,
    },
  };

  let response = await othersFunctions.apiRequest(options);

  if (response != null && response.length > 0) {
    response.forEach((walker) => {
      walkerCommands.sendWalkerInfo(msg, walker);
    });
  } else {
    othersFunctions.sendChannelMessage(msg, "No walker found");
  }
};

walkerCommands.lowalkersearchbyowner = async (msg) => {
  let page = 1;
  if (/(\s\d+)/.test(msg.content)) {
    page = msg.content.match(/(\s\d+)/)[1];
  }
  let ownerUser = msg.content
    .substring(msg.content.indexOf("lowalkersearchbyowner") + 21)
    .trim();
  const options = {
    method: "get",
    url: process.env.APP_API_URL + "/bot/walkers",
    params: {
      discordid: msg.guild.id,
      owner: ownerUser,
      page: page,
    },
    headers: {
      apiKey: process.env.APP_API_KEY,
    },
  };

  let response = await othersFunctions.apiRequest(options);

  if (response != null && response.length > 0) {
    response.forEach((walker) => {
      walkerCommands.sendWalkerInfo(msg, walker);
    });
  } else {
    othersFunctions.sendChannelMessage(msg, "No walker found");
  }
};

walkerCommands.lowalkersearchbylastuser = async (msg) => {
  let page = 1;
  if (/(\s\d+)/.test(msg.content)) {
    page = msg.content.match(/(\s\d+)/)[1];
  }
  let lastUser = msg.content
    .substring(msg.content.indexOf("lowalkersearchbylastuser") + 24)
    .trim();
  const options = {
    method: "get",
    url: process.env.APP_API_URL + "/bot/walkers",
    params: {
      discordid: msg.guild.id,
      lastuser: lastUser,
      page: page,
    },
    headers: {
      apiKey: process.env.APP_API_KEY,
    },
  };

  let response = await othersFunctions.apiRequest(options);

  if (response != null && response.length > 0) {
    response.forEach((walker) => {
      walkerCommands.sendWalkerInfo(msg, walker);
    });
  } else {
    othersFunctions.sendChannelMessage(msg, "No walker found");
  }
};

walkerCommands.lowalkerinfo = async (msg, args, prefix) => {
  if (!args.length && args.length != 2) {
    msg.reply(
      "To view the information of a walker write " +
        prefix +
        "lowalkerinfo id \n```Example: " +
        prefix +
        "lowalkerinfo 721480717```"
    );
  } else {
    let walkerId = parseInt(args[0]);
    const options = {
      method: "get",
      url: process.env.APP_API_URL + "/bot/walkers",
      params: {
        discordid: msg.guild.id,
        walkerid: walkerId,
      },
      headers: {
        apiKey: process.env.APP_API_KEY,
      },
    };

    let response = await othersFunctions.apiRequest(options);

    if (response != null && response.length > 0) {
      response.forEach((walker) => {
        walkerCommands.sendWalkerInfo(msg, walker);
      });
    } else {
      othersFunctions.sendChannelMessage(msg, "No walker found");
    }
  }
};

walkerCommands.sendWalkerInfo = (msg, walker) => {
  if (walker != null) {
    let date = new Date(walker.datelastuse);
    let message = new Discord.MessageEmbed()
      .setColor("#58ACFA")
      .setTitle(walker.name);
    message.addField("Walker ID", walker.walkerID, true);
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
    if (walker.description != null && walker.description) {
      message.addField("Ready", ":white_check_mark:");
    } else {
      message.addField("Ready", ":x:");
    }
    othersFunctions.sendChannelMessage(msg, message);
  }
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
    headers: {
      apiKey: process.env.APP_API_KEY,
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
    headers: {
      apiKey: process.env.APP_API_KEY,
    },
  };

  let response = await othersFunctions.apiRequest(options);

  if (response != null && response.length > 0) {
    response.forEach((walker) => {
      if (
        !(walker.ownerUser == null || !walker.ownerUser) &&
        walker.ownerUser != newWalker.lastUser
      ) {
        othersFunctions.sendChannelMessage(
          msg,
          "@everyone Alert the walker with owner has been used"
        );
      }
    });
  } else {
    othersFunctions.sendChannelMessage(msg, "No walker found");
  }
};

module.exports = walkerCommands;
