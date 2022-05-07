const controller = {};

require("dotenv").config();
const othersFunctions = require("./others");

controller.getClanPermissions = async (discordId) => {
  const options = {
    method: "get",
    url: `${process.env.APP_API_URL}/bot/${discordId}/members`,
  };

  let response = await othersFunctions.apiRequest(options);

  if (response.success) {
    return response.data;
  } else {
    return null;
  }
};

controller.userHasPermissions = async (
  serverDiscordID,
  userDiscordId,
  permissionType
) => {
  if (serverDiscordID && userDiscordId && permissionType) {
    let allClanPermissions = await controller.getClanPermissions(
      serverDiscordID
    );

    if (allClanPermissions != null) {
      let user = allClanPermissions.find(
        (userData) => userData.discordID === userDiscordId
      );
      if (user && user[permissionType] === "1") {
        return true;
      }
    }
  }

  return false;
};

module.exports = controller;
