const { ActivityType } = require("discord.js");
const client = require("../index");
const { registerSlashCommands } = require("../handlers/functions");
const server = require("../server.js");
const Database = require("../handlers/Database");
const chalk = require("chalk");
client.once("ready", async () => {
  try {
    console.log(chalk.yellow.bold('--- Ready ---'));
    console.log(chalk.cyan(`${client.user.username} ${chalk.green('is online')}`));

    // Set bot activity
    client.user.setActivity({
      name: `By @xaero.id`,
      type: ActivityType.Watching,
    });

    // Load database
    await Database(client);

    // Reset music embeds for all guilds one by one
    for (const guild of client.guilds.cache.values()) {
      await client.updateembed(client, guild);
    }

    // Register slash commands
    await registerSlashCommands(client);

    // Load dashboard
    await server(client);
  } catch (error) {
    console.error("An error occurred during initialization:", error);
  }
});
