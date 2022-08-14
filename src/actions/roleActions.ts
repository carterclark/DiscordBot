import { Client, CommandInteraction, Role } from "discord.js";
import { hasClassPrefix, insertionSort } from "../textParse/textParse";
import {
  setUserNickname,
  updateUnchangableNameMemberList,
} from "./userActions";

const constants = require("../constants/constants.json");

export async function takeRoles(interaction: any, rolesToBeAssigned: string[]) {
  let classRoleTakenCount = 0;
  let userWithRoleTakenCount = 0;
  let userNotCounted: boolean;

  interaction.guild!.members.cache.forEach(
    (member: {
      roles: { cache: any[]; remove: (arg0: any) => void };
      displayName: any;
    }) => {
      userNotCounted = true;
      member.roles.cache.forEach((role: { name: string }) => {
        if (
          rolesToBeAssigned.includes(role.name) &&
          role.name != constants.personRole
        ) {
          member.roles.remove(role);
          console.log(`removing ${role.name} from ${member.displayName}`);
          if (userNotCounted) {
            userWithRoleTakenCount++;
            userNotCounted = false;
          }
          if (role.name !== constants.currentStudentRole) {
            classRoleTakenCount++;
          }
        }
      });
    }
  );

  await interaction.reply(
    `take_roles removed ${classRoleTakenCount} class roles from ${userWithRoleTakenCount} users` +
      ` in ${interaction!.guild!.name}`
  );
}

export function isRolePossessedSearch(
  username: String,
  roleName: String,
  client: any
): boolean {
  const server = client.guilds.cache.get(String(process.env.SERVER_ID));
  let hasRole = false;

  server!.members.cache.forEach(
    (member: { user: { username: String }; roles: { cache: any[] } }) => {
      if (member.user.username === username) {
        member.roles.cache.forEach((role: { name: String }) => {
          if (role.name === roleName) {
            hasRole = true;
          }
        });
      }
    }
  );

  return hasRole;
}

export function findRoleByName(roleName: String, client: any) {
  const server = client.guilds.cache.get(String(process.env.SERVER_ID));
  let roleFound = server!.roles.cache.find(
    (role: { name: String }) => role.name === roleName
  );

  return roleFound;
}

export function updateRolesToBeAssigned(
  client: any,
  rolesToBeAssigned: String[],
  classPrefixList: String[]
) {
  const server = client.guilds.cache.get(String(process.env.SERVER_ID));

  server!.roles.cache.forEach((role: { name: String }) => {
    if (
      !constants.topRoles.includes(role.name) &&
      !rolesToBeAssigned.includes(role.name) &&
      constants.everyoneRole !== role.name
    ) {
      rolesToBeAssigned.push(role.name);
      console.log(`role [${role.name}] added to rolesToBeAssigned list`);
      addToClassPrefixList(role.name, classPrefixList);
    }
  });
}

export function fetchListOfRolesSorted(rolesCache: any) {
  let roleArray: String[] = [];
  let roleString: String = ``;

  rolesCache.forEach((role: any) => {
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
      console.log(`prefix [${prefix}] added to classPrefixList`);
      break;
    }

    prefix += text;
  }
}

export function roleIsInMemberCache(member: any, roleToCheck: string): boolean {
  const tempRole = member.roles.cache.find(
    (role: { name: string }) => role.name === roleToCheck
  );
  return tempRole !== undefined;
}

export function addRoleToMember(member: any, role: Role) {
  member.roles.add(role);
}

export function checksForAndAddsRole(
  roleName: string,
  interaction: any,
  client: Client
): boolean {
  const hasRole = roleIsInMemberCache(interaction.member!, roleName);

  if (!hasRole) {
    const roleToBeAdded = findRoleByName(roleName, client);
    addRoleToMember(interaction.member, roleToBeAdded);
  }
  return hasRole;
}

export async function roleMeCommand(
  interaction: CommandInteraction,
  authorUsername: string,
  client: Client,
  unchangableNameMemberList: string[],
  rolesToBeAssigned: string[],
  classPrefixList: string[]
) {
  const message = interaction.options.getString("input", true);
  let splitMessage: string[] = message.split(",").join("").split(` `);
  console.log(`Role call initiated for ${authorUsername}`);

  updateUnchangableNameMemberList(client, unchangableNameMemberList);

  // to insure the first element is the persons name and not a class
  if (
    !rolesToBeAssigned.includes(splitMessage.at(0)!) &&
    !hasClassPrefix(splitMessage.at(0)!, classPrefixList)
  ) {
    let personName = ``;
    let rolesAdded: any[] = [];
    let rolesSkipped: any[] = [];
    let currentlyReadingName = true;

    if (!checksForAndAddsRole(constants.personRole, interaction, client)) {
      rolesAdded.push(constants.personRole);
    }

    if (
      !checksForAndAddsRole(constants.currentStudentRole, interaction, client)
    ) {
      rolesAdded.push(constants.currentStudentRole);
    }

    for (const messageElement of splitMessage) {
      const messageElementUpper = messageElement.toUpperCase();

      // this is a recognized role
      if (rolesToBeAssigned.includes(messageElementUpper)) {
        currentlyReadingName = false;
        let roleToBeAdded = findRoleByName(messageElementUpper, client)!;

        // role is recognized as a role to be assigned and member does not have it
        if (!roleIsInMemberCache(interaction.member, messageElementUpper)) {
          addRoleToMember(interaction.member, roleToBeAdded);
          rolesAdded.push(roleToBeAdded.name);
        }

        // this is a recognized role but the member already has it
        else {
          currentlyReadingName = false;
          rolesSkipped.push(messageElementUpper);
        }
      }
      // not a recognized role but is a class prefix
      else if (hasClassPrefix(messageElement, classPrefixList)) {
        currentlyReadingName = false;
        rolesSkipped.push(messageElementUpper);
      }
      // still reading name
      else if (currentlyReadingName) {
        personName += messageElement + ` `;
      }
      // element is after the name but not recongnized as a class
      else {
        rolesSkipped.push(messageElement);
      }
    }
    personName = personName.slice(0, -1);
    if (unchangableNameMemberList.includes(authorUsername)) {
      personName = `couldn't change nickname to "${personName}", role is above the bot`;
    } else {
      setUserNickname(interaction.member, personName);
    }

    await interaction.reply(
      `message: ${message}\n\n` +
        `username: ${authorUsername}` +
        `\nnickname: "${personName}"\nroles added: [${rolesAdded}]` +
        `\nroles skipped: [${rolesSkipped}]`
    );
  } else {
    await interaction.reply(
      `message: ${message}\n\nIt appears the first element in your message is a class name. \nReminder, the format is ${constants.messageRoleFormat}`
    );
  }
}
