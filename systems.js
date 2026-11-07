"use strict";

const storage = require("./storage");

function initializeSystems(client) {
  storage.ensureDirectories();

  console.log("[ZAYRA] Armazenamento inicializado.");

  client.on("guildCreate", guild => {
    try {
      storage.readGuild(guild.id);

      console.log(
        `[ZAYRA] Servidor conectado: ${guild.name}`
      );
    } catch (error) {
      console.error(
        `[ZAYRA] Erro ao carregar ${guild.id}:`,
        error
      );
    }
  });
}

module.exports = {
  initializeSystems
};
