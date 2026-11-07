
"use strict";

const {
  MessageFlags
} = require("discord.js");

const storage = require("./storage");
const utils = require("./utils");
const panels = require("./panels");

async function handleButton(interaction) {
  if (!interaction.guild) {
    return interaction.reply({
      content: "Esse painel só funciona dentro do servidor.",
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
      content: "Você não tem permissão para usar esse painel.",
      ephemeral: true
    });
  }

  const customId = interaction.customId;

  if (customId === "zayra:back") {
    return interaction.update(
      panels.createHomePanel()
    );
  }

  const systems = {
    "zayra:config:moderation": {
      title: "Moderação",
      description:
        "Configurações de punições, advertências e permissões."
    },

    "zayra:config:tickets": {
      title: "Tickets",
      description:
        "Configurações do sistema de atendimento."
    },

    "zayra:config:security": {
      title: "Segurança",
      description:
        "Configurações de proteção e segurança do servidor."
    },

    "zayra:config:feed": {
      title: "Feed",
      description:
        "Configurações das publicações e interações do feed."
    }
  };

  const selected = systems[customId];

  if (!selected) {
    return interaction.reply({
      content: "Esse botão não está configurado.",
      ephemeral: true
    });
  }

  const container = panels.createPanel(
    selected.title,
    selected.description
  );

  panels.addSeparator(container);

  const backRow = panels.createButtonRow(
    panels.createBackButton()
  );

  return interaction.update({
    flags: MessageFlags.IsComponentsV2,
    components: [
      container,
      backRow
    ]
  });
}

async function handleInteraction(interaction) {
  try {
    if (interaction.isButton()) {
      return await handleButton(interaction);
    }

    if (interaction.isStringSelectMenu()) {
      return interaction.reply({
        content: "Esse menu ainda não foi conectado.",
        ephemeral: true
      });
    }

    if (interaction.isModalSubmit()) {
      return interaction.reply({
        content: "Esse formulário ainda não foi conectado.",
        ephemeral: true
      });
    }
  } catch (error) {
    console.error("Erro em uma interação:", error);

    const response = {
      content: "Ocorreu um erro ao processar essa interação.",
      ephemeral: true
    };

    if (interaction.replied || interaction.deferred) {
      return interaction.followUp(response);
    }

    return interaction.reply(response);
  }
}

module.exports = {
  handleInteraction
};
