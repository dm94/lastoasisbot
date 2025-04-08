const controller = {};

require("dotenv").config();
const othersFunctions = require("./others");

controller.getClanPermissions = async (discordId) => {
  const options = {
    method: "get",
    url: `${process.env.APP_API_URL}/bot/${discordId}/members`,
  };

  const response = await othersFunctions.apiRequest(options);

  if (response.success) {
    return response.data;
  }

  return null;
};

controller.userHasPermissions = async (
  serverDiscordID,
  userDiscordId,
  permissionType
) => {
  if (serverDiscordID && userDiscordId && permissionType) {
    const allClanPermissions = await controller.getClanPermissions(
      serverDiscordID
    );

    if (allClanPermissions != null) {
      const user = allClanPermissions.find(
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
