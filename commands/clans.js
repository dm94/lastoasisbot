const clanCommands = {};

require("dotenv").config();
const othersFunctions = require("../helpers/others");

clanCommands.kickMember = async (msg, user) => {
  let discordid = msg.guild.id;

  if (discordid != null) {
    const options = {
      method: "put",
      url: process.env.APP_API_URL + "/bot/clans/" + discordid,
      params: {
        nick: user,
      },
    };

    let response = await othersFunctions.apiRequest(options);

    if (response != null) {
      othersFunctions.sendChannelMessage(msg.channel, "Member kicked");
    } else {
      othersFunctions.sendChannelMessage(
        msg.channel,
        "Error the member could not be kicked"
      );
    }
  }
};

module.exports = clanCommands;
