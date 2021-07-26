const controller = {};

require("dotenv").config();
const othersFunctions = require("./others");

controller.getConfigurations = async () => {
  const options = {
    method: "get",
    url: process.env.APP_API_URL + "/bot/config",
  };

  return await othersFunctions.apiRequest(options);
};

controller.updateConfiguration = async (guildId) => {
  const options = {
    method: "put",
    url: process.env.APP_API_URL + "/bot/config/" + guildId,
    params: {
      languaje: "en",
      clanlog: true,
      kick: false,
      readypvp: false,
      walkeralarm: false,
    },
  };

  await othersFunctions.apiRequest(options);
};

module.exports = controller;
