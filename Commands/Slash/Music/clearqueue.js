const {
  CommandInteraction,
  PermissionFlagsBits,
  ApplicationCommandType,
} = require("discord.js");
const VLYXENN = require("../../../handlers/Client");
const { Queue } = require("distube");

module.exports = {
  name: "clearqueue",
  description: `clear current queue in server`,
  userPermissions: PermissionFlagsBits.Connect,
  botPermissions: PermissionFlagsBits.Connect,
  category: "Music",
  cooldown: 5,
  type: ApplicationCommandType.ChatInput,
  inVoiceChannel: true,
  inSameVoiceChannel: true,
  Player: true,
  djOnly: true,

  /**
   *
   * @param {VLYXENN} client
   * @param {CommandInteraction} interaction
   * @param {String[]} args
   * @param {Queue} queue
   */
  run: async (client, interaction, args, queue) => {
    // Code
    queue.remove();
    client.embed(
      interaction,
      `${client.config.emoji.SUCCESS} Queue Cleared !!`
    );
  },
};
