const controller = {};

const Axios = require("axios");
const logger = require("./logger");

controller.sendChannelMessage = (channel, text) => {
  controller.sendChannelData(channel, text);
};

controller.sendChannelData = (channel, data) => {
  channel.send(data).catch((error) => {
    logger.error(error);
  });
};

controller.apiRequest = async (options) => {
  if (!process.env.APP_API_KEY || !process.env.APP_API_URL) {
    logger.error(
      "You need to configure the APP_API_KEY and APP_API_URL to use this function."
    );
    return {
      success: false,
      data: "You need to configure the APP_API_KEY and APP_API_URL to use this function.",
    };
  }

  options.headers = {
    apiKey: process.env.APP_API_KEY,
    "Content-type": "charset=utf-8",
  };
  return Axios.request(options)
    .then((response) => {
      if (response.status == "400") {
        return {
          success: false,
          data: "Error: Missing data",
        };
      } else if (response.status == "401") {
        return {
          success: false,
          data: "Error: You do not have permissions",
        };
      } else if (response.status == "404") {
        return {
          success: false,
          data: "Error: Nothing found",
        };
      } else if (response.status == "503") {
        return {
          success: false,
          data: "Error connecting to database",
        };
      } else {
        return {
          success: true,
          data: response.data,
        };
      }
    })
    .catch((error) => {
      logger.info(options);
      logger.error(error.message);
      if (error.response) {
        if (error.response.status == "400") {
          return {
            success: false,
            data: "Error: Missing data",
          };
        } else if (error.response.status == "401") {
          return {
            success: false,
            data: "Error: You do not have permissions",
          };
        } else if (error.response.status == "404") {
          return {
            success: false,
            data: "Error: Nothing found",
          };
        } else if (error.response.status == "503") {
          return {
            success: false,
            data: "Error connecting to database",
          };
        }
      }
      return {
        success: false,
        data: "Error when connecting to the API",
      };
    });
};

module.exports = controller;
