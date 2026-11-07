
"use strict";

const {
  SlashCommandBuilder,
  ChannelType,
  PermissionFlagsBits
} = require("discord.js");

const storage = require("./storage");
const utils = require("./utils");
const panels = require("./panels");

const commands = [
  new SlashCommandBuilder()
    .setName("config")
    .setDescription("Configurar os sistemas da ZAYRA")
    .addChannelOption(option =>
      option
        .setName("canal")
        .setDescription("Canal onde o painel será publicado")
        .addChannelTypes(ChannelType.GuildText)
        .setRequired(false)
    )
];

async function execute(interaction) {
  if (!interaction.guild) {
    return interaction.reply({
      content: "Esse comando só pode ser usado em um servidor.",
      ephemeral: true
    });
  }

  const data = storage.readGuild(interaction.guild.id);

  const allowed = utils.canManageConfig(
    interaction.guild,
    interaction.member,
    data
  );

  if (!allowed) {
    return interaction.reply({
      content: "Você não tem permissão para configurar a ZAYRA.",
      ephemeral: true
    });
  }

  const channel =
    interaction.options.getChannel("canal") ||
    interaction.channel;

  if (!channel || !channel.isTextBased()) {
    return interaction.reply({
      content: "Escolha um canal de texto válido.",
      ephemeral: true
    });
  }

  if (
    !channel.permissionsFor(interaction.guild.members.me)
      ?.has(PermissionFlagsBits.SendMessages)
  ) {
    return interaction.reply({
      content: "Não tenho permissão para enviar mensagens nesse canal.",
      ephemeral: true
    });
  }

  const message = await channel.send(
    panels.createHomePanel()
  );

  await interaction.reply({
    content: `Painel da ZAYRA publicado em ${channel}.`,
    ephemeral: true
  });

  return message;
}

module.exports = {
  commands,
  execute
};
