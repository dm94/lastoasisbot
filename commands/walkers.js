const walkerCommands = {};

require("dotenv").config();
const Discord = require("discord.js");
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
    } else if (arg.startsWith("ready")) {
      params.ready = 1;
    } else if (arg.startsWith("pvp")) {
      params.use = "pvp";
    } else if (arg.startsWith("farming")) {
      params.use = "farming";
    }
  });

  params.page = page;

  const options = {
    method: "get",
    url: process.env.APP_API_URL + "/bot/walkers",
    params: params,
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
  if (args.length != 2) {
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
    const options = {
      method: "get",
      url: process.env.APP_API_URL + "/bot/walkers",
      params: {
        discordid: msg.guild.id,
        walkerid: walkerId,
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
    if (walker.isReady != null && walker.isReady) {
      message.addField("Ready", ":white_check_mark:");
    } else {
      message.addField("Ready", ":x:");
    }
    othersFunctions.sendChannelMessage(msg, message);
  }
};

walkerCommands.setnotreadypvp = async (walkerid, msg) => {
  const options = {
    method: "get",
    url: process.env.APP_API_URL + "/bot/walkers",
    params: {
      discordid: msg.guild.id,
      walkerid: walkerid,
    },
  };

  let response = await othersFunctions.apiRequest(options);

  if (response != null && response.length > 0) {
    response.forEach((walker) => {
      if (
        walker.walker_use != null &&
        walker.walker_use === "PVP" &&
        walker.isReady != null &&
        walker.isReady
      ) {
        console.log("Set not ready pvp" + walkerid);
        const optionsUpdate = {
          method: "put",
          url: process.env.APP_API_URL + "/bot/walkers/" + walkerid,
        };
        othersFunctions.apiRequest(optionsUpdate);
      }
    });
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
  };
  console.log("Added walker: " + newWalker.walkerID);
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
