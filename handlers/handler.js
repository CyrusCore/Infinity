const { readdirSync } = require("fs");
const { slash } = require("../settings/config");
const VLYXENN = require("./Client");
const chalk = require("chalk");

/**
 *
 * @param {VLYXENN} client
 */
module.exports = async (client) => {
  // LOADING SLASH COMMANDS
  try {
    let allCommands = [];
    readdirSync("./Commands/Slash").forEach((dir) => {
      const commands = readdirSync(`./Commands/Slash/${dir}`).filter((f) =>
        f.endsWith(".js")
      );

      for (const cmd of commands) {
        const command = require(`../Commands/Slash/${dir}/${cmd}`);
        if (command.name) {
          client.commands.set(command.name, command);
          allCommands.push(command);
        } else {
          console.log(`${cmd} is not ready`);
        }
      }
    });
    console.log(chalk.blue.bold('--- Loading ---'));
    console.log(chalk.green(`${client.commands.size} Slash Commands Loaded`));
  } catch (e) {
    console.log(e);
  }

  // LOADING MESSAGE COMMANDS
  try {
    readdirSync("./Commands/Message").forEach((dir) => {
      const commands = readdirSync(`./Commands/Message/${dir}`).filter((f) =>
        f.endsWith(".js")
      );

      for (const cmd of commands) {
        const command = require(`../Commands/Message/${dir}/${cmd}`);
        if (command.name) {
          client.mcommands.set(command.name, command);
          if (command.aliases && Array.isArray(command.aliases))
            command.aliases.forEach((a) => client.aliases.set(a, command.name));
        } else {
          console.log(`${cmd} is not ready`);
        }
      }
    });
    console.log(chalk.green(`${client.mcommands.size} Message Commands Loaded`));
  } catch (error) {
    console.log(error);
  }

  // Loading Event Files
  try {
    let eventCount = 0;
    readdirSync("./events")
      .filter((f) => f.endsWith(".js"))
      .forEach((event) => {
        require(`../events/${event}`);
        eventCount++;
      });
    console.log(chalk.green(`${eventCount} Events Loaded`));
    console.log(chalk.blue.bold('-----------------------------'));
  } catch (e) {
    console.log(e);
  }
};