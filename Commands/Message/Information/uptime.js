const { Message, PermissionFlagsBits } = require("discord.js");
const VLYXENN = require("../../../handlers/Client");
const { Queue } = require("distube");

module.exports = {
  name: "uptime",
  aliases: ["up"],
  description: `see when bot comes online`,
  userPermissions: PermissionFlagsBits.SendMessages,
  botPermissions: PermissionFlagsBits.EmbedLinks,
  category: "Information",
  cooldown: 5,
  inVoiceChannel: false,
  inSameVoiceChannel: false,
  Player: false,
  djOnly: false,

  /**
   *
   * @param {VLYXENN} client
   * @param {Message} message
   * @param {String[]} args
   * @param {String} prefix
   * @param {Queue} queue
   */
  run: async (client, message, args, prefix, queue) => {
    // Code
    client.embed(
      message,
      `Uptime :: <t:${Math.floor(Date.now() / 1000 - client.uptime / 1000)}:R>`
    );
  },
};
