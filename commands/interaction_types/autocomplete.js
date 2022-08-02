const itemController = require("../items");
const logger = require("../../helpers/logger");

const controller = {};
let walkerTypes = [];

controller.router = (interaction) => {
  try {
    if (interaction.commandName === "walkersearch") {
      controller.walkersearch(interaction);
    } else if (interaction.commandName === "craft") {
      controller.craft(interaction);
    }
  } catch (e) {
    logger.error(e);
  }
};

controller.craft = async (interaction) => {
  const focusedOption = interaction.options.getFocused(true);
  let items = [];

  if (focusedOption.name === "item") {
    const allItems = await itemController.getAllItems();
    if (allItems) {
      items = allItems;
    }
  }

  let filtered = [];
  if (focusedOption.value.length > 5) {
    filtered = items
      .filter((it) => {
        return focusedOption.value.split(" ").every((word) => {
          return it.name.toLowerCase().includes(word.toLowerCase());
        });
      })
      .map((item) => {
        return item.name;
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
        let onlyWalkers = allItems
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
