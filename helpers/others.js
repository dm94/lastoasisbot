const controller = {};

const Axios = require("axios");

controller.sendChannelMessage = (msg, text) => {
  try {
    msg.channel.send(text);
  } catch (error) {
    console.log(error);
  }
};

controller.apiRequest = async (options) => {
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
