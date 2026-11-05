"use strict";

const {
  PermissionFlagsBits
} = require("discord.js");

function isOwner(guild, userId) {
  return guild.ownerId === userId;
}

function hasPermission(member, permission) {
  return member.permissions.has(permission);
}

function isAdministrator(member) {
  return hasPermission(
    member,
    PermissionFlagsBits.Administrator
  );
}

function canManageConfig(guild, member, data) {
  if (isOwner(guild, member.id)) {
    return true;
  }

  if (isAdministrator(member)) {
    return true;
  }

  const managerRoles =
    data.permissions?.configManagers || [];

  return member.roles.cache.some(role =>
    managerRoles.includes(role.id)
  );
}

function hasAnyRole(member, roleIds = []) {
  if (!member || !roleIds.length) {
    return false;
  }

  return member.roles.cache.some(role =>
    roleIds.includes(role.id)
  );
}

function createLog(title, description) {
  return {
    title,
    description,
    timestamp: new Date().toISOString()
  };
}

function formatDate(date = new Date()) {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short"
  }).format(date);
}

function safeText(value, maxLength = 1000) {
  if (typeof value !== "string") {
    return "";
  }

  return value.slice(0, maxLength);
}

module.exports = {
  isOwner,
  hasPermission,
  isAdministrator,
  canManageConfig,
  hasAnyRole,
  createLog,
  formatDate,
  safeText
};
