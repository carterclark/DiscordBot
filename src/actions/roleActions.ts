import { Client, CommandInteraction, Role } from "discord.js";
import { hasClassPrefix, insertionSort } from "../textParse/textParse";
import {
  setUserNickname,
  updateUnchangableNameMemberList as syncUnchangableNameMemberList,
} from "./userActions";

const constants = require("../constants/constants.json");

export async function takeRoles(
  interaction: any,
  roleNamesToRoles: Map<string, Role>
) {
  let classRoleTakenCount = 0;
  let userWithRoleTakenCount = 0;
  let userNotCounted: boolean;
  let rolesToBeRemoved: Role[] = [];
  let rolesRemovedNames: string[] = [];
  const rolesToBeAssigned: String[] = Array.from(roleNamesToRoles.keys());

  interaction.guild!.members.cache.forEach(
    (member: {
      roles: { cache: any[]; remove: (arg0: any) => void };
      displayName: any;
    }) => {
      userNotCounted = true;
      member.roles.cache.forEach((role: Role) => {
        if (
          rolesToBeAssigned.includes(role.name) &&
          role.name != constants.personRole
        ) {
          rolesToBeRemoved.push(role);
          rolesRemovedNames.push(role.name);
          if (userNotCounted) {
            userWithRoleTakenCount++;
            userNotCounted = false;
          }
          if (role.name !== constants.currentStudentRole) {
            classRoleTakenCount++;
          }
        }
      });

      if (rolesToBeRemoved.length !== 0) {
        member.roles.remove(rolesToBeRemoved);
        console.log(
          `Removing [${rolesRemovedNames}] from ${member.displayName}`
        );

        rolesToBeRemoved = [];
        rolesRemovedNames = [];
      }
    }
  );

  await interaction.reply(
    `take_roles removed ${classRoleTakenCount} class roles from ${userWithRoleTakenCount} users` +
      ` in ${interaction!.guild!.name}`
  );
}

export function syncRolesToBeAssigned(
  client: any,
  roleNamesToRoles: Map<string, Role>,
  classPrefixList: String[]
) {
  const server = client.guilds.cache.get(String(process.env.SERVER_ID));
  const rolesToBeAssigned: String[] = Array.from(roleNamesToRoles.keys());

  server!.roles.cache.forEach((role: Role) => {
    const roleName = role.name;
    if (
      !constants.topRoles.includes(roleName) &&
      !rolesToBeAssigned.includes(roleName) &&
      constants.everyoneRole !== roleName &&
      constants.newRoleName !== roleName
    ) {
      roleNamesToRoles.set(roleName, role);
      console.log(`role [${roleName}] added to roleNamesToRoles list`);
      addToClassPrefixList(roleName, classPrefixList);
    }
  });
}

export function fetchListOfRolesSorted(rolesCache: any) {
  let roleArray: String[] = [];
  let roleString: String = ``;

  rolesCache.forEach((role: Role) => {
    const roleName = role.name;
    if (
      constants.everyoneRole !== roleName &&
      constants.personRole !== roleName &&
      !constants.topRoles.includes(roleName)
    ) {
      roleArray.push(roleName);
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

export function addRolesToMember(member: any, role: Role[]) {
  member.roles.add(role);
}

export async function roleMeCommand(
  interaction: CommandInteraction,
  authorUsername: string,
  client: Client,
  unchangableNameMemberList: string[],
  roleNamesToRoles: Map<string, Role>,
  classPrefixList: string[]
) {
  const message = interaction.options.getString("input", true);
  const rolesToBeAssigned: String[] = Array.from(roleNamesToRoles.keys());
  let splitMessage: string[] = message.split(" ");

  // to insure the first element is the persons name and not a class
  if (
    !rolesToBeAssigned.includes(splitMessage.at(0)!) &&
    !hasClassPrefix(splitMessage.at(0)!, classPrefixList)
  ) {
    console.log(`\nrole_me call initiated for ${authorUsername}`);
    let nameFromMessage = { value: `` };
    let rolesToBeAdded: any[] = [];
    let roleNamesAdded: string[] = [];
    let rolesSkipped: any[] = [];

    if (!roleIsInMemberCache(interaction.member, constants.personRole)) {
      rolesToBeAdded.push(roleNamesToRoles.get(constants.personRole));
      roleNamesAdded.push(constants.personRole);
    }

    if (
      !roleIsInMemberCache(interaction.member, constants.currentStudentRole)
    ) {
      rolesToBeAdded.push(roleNamesToRoles.get(constants.currentStudentRole));
      roleNamesAdded.push(constants.currentStudentRole);
    }

    // extract everything before the first class prefix
    extractNameFromMessage(splitMessage, classPrefixList, nameFromMessage);
    let personName = nameFromMessage.value;

    let splitMessageWithoutName = splitMessage.join("").split(",");

    // go through and edit every class name without a dash
    formatClassNames(splitMessageWithoutName);

    //assign roles
    for (const messageElement of splitMessageWithoutName) {
      const messageElementUpper = messageElement.toUpperCase();

      // this is a recognized role
      if (rolesToBeAssigned.includes(messageElementUpper)) {
        let roleToBeAdded: Role = roleNamesToRoles.get(messageElementUpper)!;

        // role is recognized as a role to be assigned and member does not have it
        if (!roleIsInMemberCache(interaction.member, messageElementUpper)) {
          rolesToBeAdded.push(roleToBeAdded);
          roleNamesAdded.push(roleToBeAdded.name);
        }

        // this is a recognized role but the member already has it
        else {
          rolesSkipped.push(messageElementUpper);
        }
      }
      // not a recognized role but has a class prefix
      else if (hasClassPrefix(messageElement, classPrefixList)) {
        rolesSkipped.push(messageElementUpper);
      }
      // element is not recognized with a class prefix
      else {
        rolesSkipped.push(messageElement);
      }
    }

    addRolesToMember(interaction.member, rolesToBeAdded);
    console.log(`Adding roles [${roleNamesAdded}] to ${authorUsername}`);

    syncUnchangableNameMemberList(client, unchangableNameMemberList);
    if (unchangableNameMemberList.includes(authorUsername)) {
      personName = `couldn't change nickname to "${personName}", role is above the bot`;
    } else {
      setUserNickname(interaction.member, personName);
    }

    await interaction.reply(
      `message: ${message}\n\n` +
        `username: ${authorUsername}` +
        `\nnickname: ${personName}\nroles added: [${roleNamesAdded}]` +
        `\nroles skipped: [${rolesSkipped}]`
    );
  } else {
    await interaction.reply(
      `message: ${message}\n\nIt appears the first element in your message is a class name. \nReminder, the format is ${constants.messageRoleFormat}`
    );
  }
}

function extractNameFromMessage(
  splitMessage: string[],
  classPrefixList: string[],
  nameFromMessage: { value: string }
) {
  for (let index = 0; index < splitMessage.length; index++) {
    if (hasClassPrefix(splitMessage[index], classPrefixList)) {
      break;
    }
    nameFromMessage.value += splitMessage.shift() + ` `;
    index--;
  }

  // remove extra space
  nameFromMessage.value = nameFromMessage.value.slice(0, -1);
}

function formatClassNames(splitMessageWithoutName: string[]) {
  for (let index = 0; index < splitMessageWithoutName.length; index++) {
    const messageElement = splitMessageWithoutName[index];

    if (messageElement.includes("-")) continue;

    let classNameEdit = ``;
    let notReadingNumber = true;
    for (const element of messageElement.split("")) {
      if (notReadingNumber && !isNaN(Number(element))) {
        //if it is a number
        classNameEdit += `-`;
        notReadingNumber = false;
      }

      classNameEdit += element;
    }

    splitMessageWithoutName[index] = classNameEdit;
  }
}
