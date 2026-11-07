
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const config = require("./config");

const serverDirectory = path.resolve(config.storage.servers);
const backupDirectory = path.resolve(config.storage.backups);

const queues = new Map();

function ensureDirectories() {
  fs.mkdirSync(serverDirectory, { recursive: true });
  fs.mkdirSync(backupDirectory, { recursive: true });
}

function validateGuildId(guildId) {
  if (!/^\d{17,20}$/.test(String(guildId))) {
    throw new Error("ID de servidor inválido.");
  }
}

function getGuildPath(guildId) {
  validateGuildId(guildId);
  return path.join(serverDirectory, `${guildId}.json`);
}

function defaultGuildData(guildId) {
  return {
    version: 1,
    guildId,

    settings: {
      prefix: config.prefix,
      language: "pt-BR"
    },

    permissions: {
      configManagers: [],
      advRoles: [],
      staffRoles: [],
      supportRoles: []
    },

    systems: {
      moderation: {
        enabled: false,
        logChannel: null
      },

      tickets: {
        enabled: false,
        panelChannel: null,
        category: null,
        supportRole: null,
        transcriptChannel: null,
        counter: 0,
        openTickets: {}
      },

      security: {
        enabled: false,
        logChannel: null,
        antiSpam: false,
        antiLinks: false,
        antiRaid: false,
        honeypotChannel: null
      },

      instagram: {
        enabled: false,
        channel: null,
        posts: {}
      },

      welcome: {
        enabled: false,
        channel: null,
        message: "Bem-vindo(a) ao servidor, {user}!"
      },

      goodbye: {
        enabled: false,
        channel: null,
        message: "Até mais, {user}!"
      },

      cleanup: {
        enabled: false,
        channel: null
      },

      publications: {
        enabled: false,
        channel: null
      }
    }
  };
}

function readGuild(guildId) {
  ensureDirectories();

  const filePath = getGuildPath(guildId);

  if (!fs.existsSync(filePath)) {
    return defaultGuildData(guildId);
  }

  try {
    const data = JSON.parse(fs.readFileSync(filePath, "utf8"));

    if (data.guildId !== guildId) {
      throw new Error("O arquivo pertence a outro servidor.");
    }

    return data;
  } catch (error) {
    throw new Error(
      `Não foi possível ler a configuração do servidor ${guildId}: ${error.message}`
    );
  }
}

function saveGuild(guildId, data) {
  ensureDirectories();

  const filePath = getGuildPath(guildId);
  const temporaryPath = `${filePath}.tmp`;

  data.guildId = guildId;
  data.version = 1;

  fs.writeFileSync(
    temporaryPath,
    JSON.stringify(data, null, 2),
    "utf8"
  );

  fs.renameSync(temporaryPath, filePath);

  return data;
}

async function updateGuild(guildId, updater) {
  const previous = queues.get(guildId) || Promise.resolve();

  const current = previous
    .catch(() => {})
    .then(async () => {
      const data = readGuild(guildId);
      const updated = await updater(data);

      return saveGuild(guildId, updated || data);
    });

  queues.set(guildId, current);

  try {
    return await current;
  } finally {
    if (queues.get(guildId) === current) {
      queues.delete(guildId);
    }
  }
}

function getGuild(guildId) {
  return readGuild(guildId);
}

module.exports = {
  ensureDirectories,
  defaultGuildData,
  getGuildPath,
  getGuild,
  readGuild,
  saveGuild,
  updateGuild
};
