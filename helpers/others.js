const controller = {};

const Axios = require("axios");

controller.sendChannelMessage = (channel, text) => {
  channel.send(text).catch((error) => {
    console.log(error);
  });
};

controller.sendChannelEmbed = (channel, embed) => {
  channel.send({ embeds: [embed] }).catch((error) => {
    console.log(error);
  });
};

controller.apiRequest = async (options) => {
  options.headers = {
    apiKey: process.env.APP_API_KEY,
    "Content-type": "charset=utf-8",
  };
  return Axios.request(options)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.log(error);
      return null;
    });
};

module.exports = controller;
