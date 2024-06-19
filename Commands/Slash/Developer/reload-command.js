const { registerSlashCommands } = require("../../../handlers/functions");
const {
    CommandInteraction,
    PermissionFlagsBits,
    ApplicationCommandType,
    Message,
} = require("discord.js");
const VLYXENN = require("../../../handlers/Client");
const { Queue } = require("distube");

module.exports = {
    name: "reloadcmd",
    description: `Reloading All Command`,
    userPermissions: PermissionFlagsBits.Administrator,
    category: "Developer",
    cooldown: 5,
    type: ApplicationCommandType.ChatInput,
    /**
    *
    * @param {VLYXENN} client
    * @param {CommandInteraction} interaction
    * @param {String[]} args
    * @param {Queue} queue
    */
    run: async (client, interaction, args, queue) => {

        await registerSlashCommands(client);
        await interaction.followUp({
          content: `Success Reloading All (/) Command\nTotal (/) Command: ${client.commands.size} `,
          ephemeral: true,
        })
    },
};
