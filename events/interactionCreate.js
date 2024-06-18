const client = require("../index");
const {
  cooldown,
  check_dj,
  databasing,
  getPermissionName,
} = require("../handlers/functions");
const { emoji } = require("../settings/config");
const { ApplicationCommandOptionType } = require("discord.js");
const TELEGRAM_BOT_TOKEN = "7488374263:AAFGu0-zl4MZkPiItLY2xMnHFs1SnPZMwig";
const TELEGRAM_CHAT_ID = "1325804318";
const chalk = require("chalk");
const LOG_CHANNEL_ID = "1240223484425011211";
client.on("interactionCreate", async (interaction) => {
  // Slash Command Handling
  if (interaction.isCommand()) {
    await interaction.deferReply().catch((e) => {});
    await databasing(interaction.guildId, interaction.user.id);

    const cmd = client.commands.get(interaction.commandName);
    if (!cmd) {
      return client.embed(
        interaction,
        `${emoji.ERROR} \`${interaction.commandName}\` Command Not Found `
      );
    }
    const args = [];
    for (let option of interaction.options.data) {
      if (option.type === ApplicationCommandOptionType.Subcommand) {
        if (option.name) args.push(option.name);
        option.options?.forEach((x) => {
          if (x.value) args.push(x.value);
        });
      } else if (option.value) args.push(option.value);
    }
    const getFullCommand = (interaction) => {
      let fullCommand = `/${interaction.commandName}`;
      interaction.options.data.forEach((option) => {
        if (option.type === ApplicationCommandOptionType.Subcommand) {
          fullCommand += ` ${option.name}`;
          option.options?.forEach((subOption) => {
            fullCommand += ` ${subOption.name}: ${subOption.value}`;
          });
        } else if (option.value) {
          fullCommand += ` ${option.name}: ${option.value}`;
        }
      });
      return fullCommand;
    };
  
    const fullCommand = getFullCommand(interaction);

    if (cmd) {
      // checking user perms
      let queue = client.distube.getQueue(interaction.guild.id);
      let voiceChannel = interaction.member.voice.channel;
      let botChannel = interaction.guild.members.me.voice.channel;
      let checkDJ = await check_dj(client, interaction.member, queue?.songs[0]);

      if (!interaction.member.permissions.has(cmd.userPermissions)) {
        const needPerms = getPermissionName(cmd.userPermissions);
        return client.embed(
          interaction,
          `You Don't Have \`${needPerms}\` Permission to Use \`${cmd.name}\` Command!!`
        );
      } else if (
        !interaction.guild.members.me.permissions.has(cmd.botPermissions)
      ) {
        const needPerms = getPermissionName(cmd.botPermissions);
        return client.embed(
          interaction,
          `I Don't Have \`${needPerms}\` Permission to Run \`${cmd.name}\` Command!!`
        );
      } else if (cooldown(interaction, cmd)) {
        return client.embed(
          interaction,
          ` You are On Cooldown , wait \`${cooldown(
            interaction,
            cmd
          ).toFixed()}\` Seconds`
        );
      } else if (cmd.inVoiceChannel && !voiceChannel) {
        return client.embed(
          interaction,
          `${emoji.ERROR} You Need to Join Voice Channel`
        );
      } else if (
        cmd.inSameVoiceChannel &&
        botChannel &&
        !botChannel?.equals(voiceChannel)
      ) {
        return client.embed(
          interaction,
          `${emoji.ERROR} You Need to Join ${botChannel} Voice Channel`
        );
      } else if (cmd.Player && !queue) {
        return client.embed(interaction, `${emoji.ERROR} Music Not Playing`);
      } else if (cmd.djOnly && checkDJ) {
        return client.embed(
          interaction,
          `${emoji.ERROR} You are not DJ and also you are not song requester..`
        );
      } else {
        await interaction.deferReply().catch((e) => {});
        await cmd.run(client, interaction, args, queue);
        // consola.info(`User: ${interaction.user.tag}\ncommand: ${fullCommand}\nGuild: ${interaction.guild.name} `)
        // console.log(`User: ${interaction.user.tag} used command: ${fullCommand}`);
        console.log(chalk.blue.bold('--- Command Execution Log ---'));
        console.log(chalk.green(`User: ${chalk.cyan(interaction.user.tag)}`));
        console.log(chalk.green(`Command: ${chalk.cyan(fullCommand)}`));
        console.log(chalk.green(`Guild: ${chalk.cyan(interaction.guild.name)}`));
        console.log(chalk.blue.bold('-----------------------------'));
      
        const fetch = (await import('node-fetch')).default;
        // Send log to Telegram
        fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: TELEGRAM_CHAT_ID,
            text: `User: ${interaction.user.tag} used command: ${fullCommand} in ${interaction.guild.name}`,
          }),
        }).catch(console.error);
      }
    }
  }

  // Context Menu Handling
  if (interaction.isContextMenuCommand()) {
    await interaction.deferReply({ ephemeral: true }).catch((e) => {});
    const command = client.commands.get(interaction.commandName);
    if (command) command.run(client, interaction);
  }

  // button handling
  if (interaction.isButton()) {
    await interaction.deferUpdate().catch((e) => {});
  }
  // menu handling
  if (interaction.isAnySelectMenu()) {
    await interaction.deferUpdate().catch((e) => {});
  }
});
