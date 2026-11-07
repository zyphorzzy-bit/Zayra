
"use strict";

const {
  MessageFlags
} = require("discord.js");

const storage = require("./storage");
const utils = require("./utils");
const panels = require("./panels");

const SYSTEMS = {
  moderation: {
    title: "Moderação",
    description:
      "Configure as funções de moderação do servidor.\n\n" +
      "As opções de punição e registros serão configuradas neste painel."
  },

  tickets: {
    title: "Tickets",
    description:
      "Configure os tickets de atendimento.\n\n" +
      "Escolha o canal do painel, a categoria e o cargo de suporte."
  },

  security: {
    title: "Segurança",
    description:
      "Configure os sistemas de proteção do servidor.\n\n" +
      "Anti-spam, anti-links, anti-raid e honeypot."
  },

  instagram: {
    title: "Instagram",
    description:
      "Configure o Instagram interno da ZAYRA.\n\n" +
      "Publicações, curtidas, comentários e controle de conteúdo."
  },

  welcome: {
    title: "Boas-vindas",
    description:
      "Configure mensagens de entrada e saída dos membros."
  },

  publications: {
    title: "Publicações",
    description:
      "Configure os canais e controles de publicações."
  }
};

async function handleButton(interaction) {
  const customId = interaction.customId;

  if (!customId.startsWith("zayra:")) {
    return false;
  }

  if (!interaction.guild) {
    await interaction.reply({
      content: "Esse painel só funciona dentro de um servidor.",
      flags: MessageFlags.Ephemeral
    });

    return true;
  }

  const data = storage.getGuild(interaction.guild.id);

  if (
    !utils.canManageConfig(
      interaction.guild,
      interaction.member,
      data
    )
  ) {
    await interaction.reply({
      content: "Você não tem permissão para usar esse painel.",
      flags: MessageFlags.Ephemeral
    });

    return true;
  }

  const action = customId.slice("zayra:".length);

  if (action === "back") {
    await interaction.update(
      panels.createHomePanel()
    );

    return true;
  }

  const system = SYSTEMS[action];

  if (!system) {
    await interaction.reply({
      content: "Essa opção não existe.",
      flags: MessageFlags.Ephemeral
    });

    return true;
  }

  await interaction.update(
    panels.createSimplePanel(
      system.title,
      system.description
    )
  );

  return true;
}

async function handleSelectMenu(interaction) {
  if (!interaction.customId.startsWith("zayra:")) {
    return false;
  }

  await interaction.reply({
    content: "Esse seletor ainda não foi configurado.",
    flags: MessageFlags.Ephemeral
  });

  return true;
}

async function handleModal(interaction) {
  if (!interaction.customId.startsWith("zayra:")) {
    return false;
  }

  await interaction.reply({
    content: "Esse formulário ainda não foi configurado.",
    flags: MessageFlags.Ephemeral
  });

  return true;
}

async function handleInteraction(interaction) {
  try {
    if (interaction.isButton()) {
      return await handleButton(interaction);
    }

    if (interaction.isStringSelectMenu()) {
      return await handleSelectMenu(interaction);
    }

    if (interaction.isModalSubmit()) {
      return await handleModal(interaction);
    }

    return false;
  } catch (error) {
    console.error("Erro na interação da ZAYRA:", error);

    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({
        content: "Ocorreu um erro ao processar essa interação.",
        flags: MessageFlags.Ephemeral
      }).catch(() => {});
    } else {
      await interaction.reply({
        content: "Ocorreu um erro ao processar essa interação.",
        flags: MessageFlags.Ephemeral
      }).catch(() => {});
    }

    return true;
  }
}

module.exports = {
  handleInteraction,
  handleButton,
  handleSelectMenu,
  handleModal
};
