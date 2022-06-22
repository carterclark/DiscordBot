import { Client, Collection, Role } from "discord.js";
import { insertionSort } from "../textParse/textParse";

const constants = require("../constants/constants.json");

export function isRolePossessed(
  username: String,
  roleName: String,
  client: Client
) {
  const server = client.guilds.cache.get(String(process.env.SERVER_ID));
  var hasRole = false;

  server!.members.cache.forEach((member) => {
    if (member.user.username === username) {
      member.roles.cache.forEach((role) => {
        if (role.name === roleName) {
          hasRole = true;
        }
      });
    }
  });

  return hasRole;
}

export function findRoleByName(roleName: String, client: Client) {
  const server = client.guilds.cache.get(String(process.env.SERVER_ID));
  let roleFound = server!.roles.cache.find((role) => role.name === roleName);

  return roleFound;
}

export function updateRolesToBeAssigned(
  client: Client,
  rolesToBeAssigned: String[],
  classPrefixList: String[]
) {
  const server = client.guilds.cache.get(String(process.env.SERVER_ID));

  server!.roles.cache.forEach((role) => {
    if (
      !constants.topRoles.includes(role.name) &&
      !rolesToBeAssigned.includes(role.name) &&
      constants.everyoneRole !== role.name
    ) {
      rolesToBeAssigned.push(role.name);
      addToClassPrefixList(role.name, classPrefixList);
    }
  });
}

export function fetchListOfRolesSorted(rolesCache: Collection<string, Role>) {
  let roleArray: String[] = [];
  let roleString: String = ``;

  rolesCache.forEach((role: Role) => {
    if (
      constants.everyoneRole !== role.name &&
      constants.personRole !== role.name &&
      !constants.topRoles.includes(role.name)
    ) {
      roleArray.push(role.name);
    }
  });
  insertionSort(roleArray);

  for (const text of roleArray) {
    roleString += `\n` + text;
  }

  return roleString;
}

export function addToClassPrefixList(
  roleName: String,
  classPrefixList: String[]
) {
  let textArray = roleName.split("");
  let prefix = "";

  for (const text of textArray) {
    if (text == "-" && !classPrefixList.includes(prefix)) {
      classPrefixList.push(prefix);
      break;
    }

    prefix += text;
  }
}