
"use strict";

const {
  Client,
  GatewayIntentBits,
  Partials,
  REST,
  Routes
} = require("discord.js");

const config = require("./config");
const commandsHandler = require("./commands");
const interactionsHandler = require("./interactions");
const systems = require("./systems");
const storage = require("./storage");

const token = process.env.DISCORD_TOKEN;
const clientId = process.env.DISCORD_CLIENT_ID;

if (!token || !clientId) {
  console.error(
    "Configure DISCORD_TOKEN e DISCORD_CLIENT_ID nas variáveis da hospedagem."
  );

  process.exit(1);
}

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildModeration
  ],
  partials: [
    Partials.User,
    Partials.Message,
    Partials.GuildMember
  ]
});

const rest = new REST({
  version: "10"
}).setToken(token);

async function registerCommands() {
  const commands = commandsHandler.commands.map(
    command => command.toJSON()
  );

  await rest.put(
    Routes.applicationCommands(clientId),
    { body: commands }
  );

  console.log("[ZAYRA] Comandos registrados.");
}

client.once("ready", async () => {
  console.log(
    `[ZAYRA] Online como ${client.user.tag}`
  );

  storage.ensureDirectories();

  systems.initializeSystems(client);

  try {
    await registerCommands();
  } catch (error) {
    console.error(
      "[ZAYRA] Erro ao registrar comandos:",
      error
    );
  }
});

client.on("interactionCreate", async interaction => {
  try {
    if (
      interaction.isChatInputCommand() &&
      interaction.commandName === "config"
    ) {
      await commandsHandler.execute(interaction);
      return;
    }

    await interactionsHandler.handleInteraction(
      interaction
    );
  } catch (error) {
    console.error(
      "[ZAYRA] Erro na interação:",
      error
    );

    const response = {
      content: "Ocorreu um erro ao executar essa ação.",
      ephemeral: true
    };

    if (interaction.replied || interaction.deferred) {
      await interaction.followUp(response).catch(() => {});
    } else {
      await interaction.reply(response).catch(() => {});
    }
  }
});

client.on("error", error => {
  console.error("[ZAYRA] Erro do cliente:", error);
});

client.login(token);
