const controller = {};
const Axios = require("axios");
const logger = require("./logger");

controller.updateStatistics = async (guildsCount, usersCount) => {
  controller.sendDiscordBotList(guildsCount, usersCount);
  controller.sendTopGG(guildsCount);
};

/**
 * To add the list of servers here: https://discordbotlist.com
 * @param {Number} guildsCount
 * @param {Number} usersCount
 */

controller.sendDiscordBotList = async (guildsCount, usersCount) => {
  if (!process.env.DISCORDBOTLIST_TOKEN) {
    return;
  }

  const options = {
    method: "post",
    url:
      "https://discordbotlist.com/api/v1/bots/" +
      process.env.DISCORD_CLIENT_ID +
      "/stats",
    data: {
      users: usersCount,
      guilds: guildsCount,
    },
    headers: {
      Authorization: process.env.DISCORDBOTLIST_TOKEN,
    },
  };
  return Axios.request(options)
    .then((response) => {
      console.log("discordbotlist updated");
      return;
    })
    .catch((error) => {
      logger.error(error);
      return;
    });
};

/**
 * To add the list of servers here: https://top.gg
 * @param {Number} guildsCount
 */

controller.sendTopGG = async (guildsCount) => {
  if (!process.env.TOPGG_TOKEN) {
    return;
  }

  const options = {
    method: "post",
    url: "https://top.gg/api/bots/" + process.env.DISCORD_CLIENT_ID + "/stats",
    data: {
      server_count: guildsCount,
    },
    headers: {
      Authorization: process.env.TOPGG_TOKEN,
    },
  };
  return Axios.request(options)
    .then((response) => {
      console.log("TopGG updated");
      return;
    })
    .catch((error) => {
      logger.error(error);
      return;
    });
};

module.exports = controller;
