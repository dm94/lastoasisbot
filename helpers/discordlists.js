const controller = {};
const Axios = require("axios");
const logger = require("./logger");

controller.updateStatistics = async (guildsCount, usersCount) => {
  controller.sendDiscordBotList(guildsCount, usersCount);
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
      "https://discordbotlist.com/api/v1/bots" +
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
  return Axios.request(options).catch((error) => {
    logger.error(error);
    return;
  });
};

module.exports = controller;
