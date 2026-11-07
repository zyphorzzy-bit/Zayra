
"use strict";

const { PermissionFlagsBits } = require("discord.js");

function isOwner(guild, userId) {
  return guild.ownerId === userId;
}

function hasPermission(member, permission) {
  return member.permissions.has(permission);
}

function isAdministrator(member) {
  return hasPermission(member, PermissionFlagsBits.Administrator);
}

function hasAnyRole(member, roleIds = []) {
  return member.roles.cache.some(role => roleIds.includes(role.id));
}

function canManageConfig(guild, member, data) {
  if (!guild || !member || !data) return false;

  if (isOwner(guild, member.id)) {
    return true;
  }

  if (isAdministrator(member)) {
    return true;
  }

  const managerRoles = data.permissions?.configManagers || [];

  return hasAnyRole(member, managerRoles);
}

function canManageTickets(member, data) {
  if (!member || !data) return false;

  if (isAdministrator(member)) {
    return true;
  }

  const supportRoles = data.permissions?.supportRoles || [];

  return hasAnyRole(member, supportRoles);
}

function canModerate(member, data) {
  if (!member || !data) return false;

  if (isAdministrator(member)) {
    return true;
  }

  const staffRoles = data.permissions?.staffRoles || [];

  return hasAnyRole(member, staffRoles);
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

function safeText(value, maxLength = 2000) {
  if (typeof value !== "string") {
    return "";
  }

  return value
    .replace(/\u0000/g, "")
    .slice(0, maxLength);
}

module.exports = {
  isOwner,
  hasPermission,
  isAdministrator,
  hasAnyRole,
  canManageConfig,
  canManageTickets,
  canModerate,
  createLog,
  formatDate,
  safeText
};
