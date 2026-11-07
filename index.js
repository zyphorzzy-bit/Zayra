
"use strict";

const {
  Client,
  GatewayIntentBits,
  Partials,
  REST,
  Routes,
  MessageFlags
} = require("discord.js");

const config = require("./config");
const commands = require("./commands");
const interactions = require("./interactions");
const systems = require("./systems");
const storage = require("./storage");

const TOKEN = process.env.DISCORD_TOKEN;
const CLIENT_ID = process.env.DISCORD_CLIENT_ID;

if (!TOKEN) {
  throw new Error("A variável DISCORD_TOKEN não está configurada.");
}

if (!CLIENT_ID) {
  throw new Error("A variável DISCORD_CLIENT_ID não está configurada.");
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
    Partials.Channel,
    Partials.Message,
    Partials.GuildMember
  ]
});

async function registerCommands() {
  const rest = new REST({ version: "10" }).setToken(TOKEN);

  await rest.put(
    Routes.applicationCommands(CLIENT_ID),
    {
      body: [
        commands.data.toJSON()
      ]
    }
  );

  console.log("[ZAYRA] Comandos registrados.");
}

client.once("ready", async () => {
  console.log(`[ZAYRA] Online como ${client.user.tag}`);

  storage.ensureDirectories();

  await systems.initializeSystems(client);
  await registerCommands();
});

client.on("interactionCreate", async interaction => {
  try {
    if (interaction.isChatInputCommand()) {
      if (interaction.commandName === "config") {
        await commands.execute(interaction);
      }

      return;
    }

    await interactions.handleInteraction(interaction);
  } catch (error) {
    console.error("[ZAYRA] Erro na interação:", error);

    const response = {
      content: "Ocorreu um erro ao executar essa interação.",
      flags: MessageFlags.Ephemeral
    };

    if (interaction.replied || interaction.deferred) {
      await interaction.followUp(response).catch(() => {});
    } else {
      await interaction.reply(response).catch(() => {});
    }
  }
});

client.on("error", error => {
  console.error("[ZAYRA] Erro do Discord:", error);
});

client.login(TOKEN);
