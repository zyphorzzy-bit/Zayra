
"use strict";

const {
  SlashCommandBuilder,
  ChannelType,
  PermissionFlagsBits,
  MessageFlags
} = require("discord.js");

const storage = require("./storage");
const utils = require("./utils");
const panels = require("./panels");

const configCommand = new SlashCommandBuilder()
  .setName("config")
  .setDescription("Abrir o painel de configuração da ZAYRA")
  .addChannelOption(option =>
    option
      .setName("canal")
      .setDescription("Canal onde o painel será publicado")
      .addChannelTypes(ChannelType.GuildText)
      .setRequired(false)
  );

async function executeConfig(interaction) {
  if (!interaction.guild) {
    return interaction.reply({
      content: "Esse comando só pode ser usado dentro de um servidor.",
      flags: MessageFlags.Ephemeral
    });
  }

  const guild = interaction.guild;
  const member = interaction.member;
  const data = storage.getGuild(guild.id);

  if (!utils.canManageConfig(guild, member, data)) {
    return interaction.reply({
      content: "Você não tem permissão para configurar a ZAYRA.",
      flags: MessageFlags.Ephemeral
    });
  }

  const channel =
    interaction.options.getChannel("canal") ||
    interaction.channel;

  if (!channel || !channel.isTextBased()) {
    return interaction.reply({
      content: "Escolha um canal de texto válido.",
      flags: MessageFlags.Ephemeral
    });
  }

  const botMember = guild.members.me;

  if (
    !botMember ||
    !channel
      .permissionsFor(botMember)
      .has(PermissionFlagsBits.SendMessages)
  ) {
    return interaction.reply({
      content: "Não tenho permissão para enviar mensagens nesse canal.",
      flags: MessageFlags.Ephemeral
    });
  }

  try {
    await channel.send(panels.createHomePanel());

    return interaction.reply({
      content: `Painel da ZAYRA publicado em ${channel}.`,
      flags: MessageFlags.Ephemeral
    });
  } catch (error) {
    console.error("Erro ao publicar painel:", error);

    return interaction.reply({
      content: "Não consegui publicar o painel.",
      flags: MessageFlags.Ephemeral
    });
  }
}

module.exports = {
  data: configCommand,
  execute: executeConfig
};
