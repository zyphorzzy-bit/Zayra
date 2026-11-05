
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

function createPanel(title, description) {
  const container = new ContainerBuilder();

  container.addTextDisplayComponents(
    new TextDisplayBuilder()
      .setContent(`# ${title}\n${description}`)
  );

  return container;
}

function addSeparator(container) {
  container.addSeparatorComponents(
    new SeparatorBuilder()
  );

  return container;
}

function createButton(
  customId,
  label,
  disabled = false
) {
  return new ButtonBuilder()
    .setCustomId(customId)
    .setLabel(label)
    .setStyle(ButtonStyle.Secondary)
    .setDisabled(disabled);
}

function createButtonRow(...buttons) {
  return new ActionRowBuilder()
    .addComponents(...buttons);
}

function createBackButton(customId = "zayra:back") {
  return createButton(customId, "Voltar");
}

function createHomePanel() {
  const container = createPanel(
    "ZAYRA • Configurações",
    "Selecione abaixo o sistema que deseja configurar."
  );

  addSeparator(container);

  const row = createButtonRow(
    createButton("zayra:config:moderation", "Moderação"),
    createButton("zayra:config:tickets", "Tickets"),
    createButton("zayra:config:security", "Segurança"),
    createButton("zayra:config:feed", "Feed")
  );

  return {
    flags: MessageFlags.IsComponentsV2,
    components: [
      container,
      row
    ]
  };
}

function createSimplePanel(title, description) {
  const container = createPanel(
    title,
    description
  );

  return {
    flags: MessageFlags.IsComponentsV2,
    components: [
      container
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
