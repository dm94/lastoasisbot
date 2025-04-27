const itemController = require("../items");
const logger = require("../../helpers/logger");

const controller = {};
let itemNames = [];

controller.router = async (interaction) => {
  try {
    if (interaction.commandName === "craft") {
      await controller.craft(interaction);
    }
  } catch (e) {
    logger.error(e);
  }
};

controller.craft = async (interaction) => {
  const focusedOption = interaction.options.getFocused(true);

  if (focusedOption.name === "item") {
    if (itemNames.length <= 0) {
      const allItems = await itemController.getAllItems();
      if (allItems) {
        itemNames = allItems
          .filter((it) => it.crafting && it.name)
          .map((it) => {
            return it.name.toLowerCase();
          });
      }
    }
  }

  let filtered = [];
  if (focusedOption.value.length >= 5) {
    filtered = itemNames
      .filter((it) => {
        return focusedOption.value.split(" ").every((word) => {
          return it.includes(word.toLowerCase());
        });
      })
      .slice(0, 20);
  }

  await interaction.respond(
    filtered.map((choice) => ({ name: choice, value: choice }))
  );
};

module.exports = controller;
