
"use strict";

const fs = require("node:fs");
const path = require("node:path");

const config = require("./config");

const serversPath = path.resolve(config.storage.servers);
const backupsPath = path.resolve(config.storage.backups);

const queues = new Map();

const defaultGuildData = (guildId) => ({
  guildId,
  version: 1,
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
    moderation: {},
    tickets: {},
    security: {},
    instagram: {},
    welcome: {},
    goodbye: {},
    cleanup: {},
    publications: {},
    premium: {}
  }
});

function ensureDirectories() {
  fs.mkdirSync(serversPath, { recursive: true });
  fs.mkdirSync(backupsPath, { recursive: true });
}

function getGuildPath(guildId) {
  if (!/^\d{17,20}$/.test(guildId)) {
    throw new Error("ID de servidor inválido.");
  }

  return path.join(serversPath, `${guildId}.json`);
}

function readGuild(guildId) {
  ensureDirectories();

  const filePath = getGuildPath(guildId);

  if (!fs.existsSync(filePath)) {
    return defaultGuildData(guildId);
  }

  try {
    const data = JSON.parse(
      fs.readFileSync(filePath, "utf8")
    );

    if (data.guildId !== guildId) {
      throw new Error("O ID do servidor não corresponde.");
    }

    return data;
  } catch (error) {
    throw new Error(
      `Não foi possível ler a configuração de ${guildId}: ${error.message}`
    );
  }
}

function saveGuild(guildId, data) {
  ensureDirectories();

  const filePath = getGuildPath(guildId);
  const temporaryPath = `${filePath}.tmp`;

  const safeData = {
    ...data,
    guildId,
    version: 1
  };

  fs.writeFileSync(
    temporaryPath,
    JSON.stringify(safeData, null, 2),
    "utf8"
  );

  fs.renameSync(temporaryPath, filePath);

  return safeData;
}

function updateGuild(guildId, updater) {
  const previous = queues.get(guildId) || Promise.resolve();

  const current = previous
    .catch(() => {})
    .then(() => {
      const data = readGuild(guildId);
      const updated = updater(data);

      return saveGuild(guildId, updated || data);
    });

  queues.set(guildId, current);

  return current.finally(() => {
    if (queues.get(guildId) === current) {
      queues.delete(guildId);
    }
  });
}

module.exports = {
  ensureDirectories,
  defaultGuildData,
  readGuild,
  saveGuild,
  updateGuild
};
