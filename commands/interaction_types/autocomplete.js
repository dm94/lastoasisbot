const itemController = require("../items");
const logger = require("../../helpers/logger");

const controller = {};
let walkerTypes = [];
let itemNames = [];

controller.router = async (interaction) => {
  try {
    if (interaction.commandName === "walkersearch") {
      await controller.walkersearch(interaction);
    } else if (interaction.commandName === "craft") {
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

controller.walkersearch = async (interaction) => {
  const focusedOption = interaction.options.getFocused(true);

  if (focusedOption.name === "type") {
    if (walkerTypes.length <= 0) {
      const allItems = await itemController.getAllItems();
      if (allItems) {
        const onlyWalkers = allItems
          .filter((item) => item.category === "Walkers")
          .map((item) => {
            return item.name.replace("Walker", "").trim();
          });

        if (focusedOption.name === "type") {
          walkerTypes = onlyWalkers;
        }
      }
    }
  }

  const filtered = walkerTypes.filter((choice) =>
    choice.toLowerCase().includes(focusedOption.value.toLowerCase())
  );

  await interaction.respond(
    filtered.map((choice) => ({ name: choice, value: choice }))
  );
};

module.exports = controller;
