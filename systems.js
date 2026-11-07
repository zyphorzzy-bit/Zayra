
"use strict";

const storage = require("./storage");

async function initializeSystems(client) {
  storage.ensureDirectories();

  console.log("[ZAYRA] Sistemas inicializados.");

  client.on("guildCreate", guild => {
    try {
      const data = storage.getGuild(guild.id);

      storage.saveGuild(guild.id, data);

      console.log(
        `[ZAYRA] Configuração criada para: ${guild.name}`
      );
    } catch (error) {
      console.error(
        `[ZAYRA] Erro ao configurar ${guild.name}:`,
        error
      );
    }
  });
}

module.exports = {
  initializeSystems
};
