
"use strict";

module.exports = {
  name: "ZAYRA",
  prefix: "za.",
  language: "pt-BR",

  // Visual padrão
  componentsV2: true,
  buttonStyle: "Secondary",

  // Status roxo
  status: {
    enabled: true,
    interval: 15000,
    streamingUrl: "https://www.twitch.tv/discord",

    activities: [
      "ZAYRA ♡ /config",
      "ZAYRA ♡ a touch of magic",
      "ZAYRA • made with love",
      "ZAYRA ♡ your little guardian",
      "ZAYRA • elegance in every detail",
      "ZAYRA ♡ always by your side"
    ]
  },

  // Arquivos de configuração
  storage: {
    directory: "./storage",
    guilds: "./storage/servers"
  }
};
