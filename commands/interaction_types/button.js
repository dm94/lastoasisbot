const clanCommands = require("../clans");
const logger = require("../../helpers/logger");

const controller = {};

controller.router = async (interaction) => {
  try {
    if (interaction.customId.includes("updateDiplomacyList-")) {
      await interaction.deferUpdate();
      clanCommands.updateDiplomacyList(interaction);
    }
  } catch (e) {
    logger.error(e);
  }
};

module.exports = controller;
