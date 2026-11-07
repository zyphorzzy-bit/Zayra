
"use strict";

const {
  ContainerBuilder,
  TextDisplayBuilder,
  SeparatorBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  MessageFlags
} = require("discord.js");

const config = require("./config");

function createPanel(title, description = "") {
  const container = new ContainerBuilder();

  container.addTextDisplayComponents(
    new TextDisplayBuilder().setContent(
      `# ${config.emojis.zayra1} ${title}\n${description}`
    )
  );

  return {
    flags: MessageFlags.IsComponentsV2,
    components: [container]
  };
}

function addSeparator(container) {
  container.addSeparatorComponents(
    new SeparatorBuilder()
  );

  return container;
}

function createButton(customId, label, emoji = null) {
  const button = new ButtonBuilder()
    .setCustomId(customId)
    .setLabel(label)
    .setStyle(ButtonStyle.Secondary);

  if (emoji) {
    button.setEmoji(emoji);
  }

  return button;
}

function createButtonRow(...buttons) {
  return new ActionRowBuilder().addComponents(buttons);
}

function createBackButton() {
  return createButton(
    "zayra:back",
    "Voltar",
    config.emojis.voltarEsquerda
  );
}

function createHomePanel() {
  const container = new ContainerBuilder();

  container.addTextDisplayComponents(
    new TextDisplayBuilder().setContent(
      `# ${config.emojis.zayra1} ZAYRA — Configuração\n` +
      "Configure os sistemas do seu servidor pelos menus abaixo.\n\n" +
      `${config.emojis.config} **Sistemas disponíveis**\n` +
      "・Moderação\n" +
      "・Tickets\n" +
      "・Segurança\n" +
      "・Instagram\n" +
      "・Boas-vindas e despedidas\n" +
      "・Publicações"
    )
  );

  container.addSeparatorComponents(
    new SeparatorBuilder()
  );

  return {
    flags: MessageFlags.IsComponentsV2,
    components: [
      container,
      createButtonRow(
        createButton("zayra:moderation", "Moderação", config.emojis.escudo),
        createButton("zayra:tickets", "Tickets", config.emojis.ticket),
        createButton("zayra:security", "Segurança", config.emojis.cadeado),
        createButton("zayra:instagram", "Instagram", config.emojis.filme)
      ),
      createButtonRow(
        createButton("zayra:welcome", "Boas-vindas", config.emojis.sino),
        createButton("zayra:publications", "Publicações", config.emojis.digital)
      )
    ]
  };
}

function createSimplePanel(title, description) {
  const container = new ContainerBuilder();

  container.addTextDisplayComponents(
    new TextDisplayBuilder().setContent(
      `# ${config.emojis.zayra1} ${title}\n${description}`
    )
  );

  container.addSeparatorComponents(
    new SeparatorBuilder()
  );

  return {
    flags: MessageFlags.IsComponentsV2,
    components: [
      container,
      createButtonRow(createBackButton())
    ]
  };
}

module.exports = {
  createPanel,
  addSeparator,
  createButton,
  createButtonRow,
  createBackButton,
  createHomePanel,
  createSimplePanel
};
