import { Client, CommandInteraction, GuildMember, Role } from "discord.js";
import { hasClassPrefix, insertionSort } from "../textParse/textParse";
import { updateUnchangableNameMemberList as syncUnchangableNameMemberList } from "./userActions";

const constants = require("../constants/constants.json");

export async function takeRoles(
  interaction: CommandInteraction,
  roleNamesToRoles: Map<string, Role>
) {
  let classRoleTakenCount = 0;
  let userWithRoleTakenCount = 0;
  let userNotCounted: boolean;
  let rolesToBeRemoved: Role[] = [];
  let rolesRemovedNames: string[] = [];
  const rolesToBeAssigned: String[] = Array.from(roleNamesToRoles.keys());

  interaction.guild!.members.cache.forEach((member: GuildMember) => {
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
      console.log(`Removing [${rolesRemovedNames}] from ${member.displayName}`);

      rolesToBeRemoved = [];
      rolesRemovedNames = [];
    }
  });

  await interaction.reply(
    `take_roles removed ${classRoleTakenCount} class roles from ${userWithRoleTakenCount} users` +
      ` in ${interaction!.guild!.name}`
  );
}

export function syncRolesToBeAssigned(
  client: Client,
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

export function getRoleNamesSorted(roleNamesToRoles: Map<string, Role>) {
  let roleArray: String[] = [];
  let roleString: String = ``;

  roleNamesToRoles.forEach((role: Role) => {
    const roleName = role.name;
    if (
      constants.personRole !== roleName &&
      !constants.topRoles.includes(roleName)
    ) {
      roleArray.push(roleName);
    }
  });
  insertionSort(roleArray as string[]);

  for (const text of roleArray) {
    roleString += `\n` + text;
  }

  return roleString;
}

export async function roleMeCommand(
  interaction: CommandInteraction,
  authorUsername: string,
  client: Client,
  unchangableNameMemberList: string[],
  roleNamesToRoles: Map<string, Role>,
  classPrefixList: string[]
) {
  const classes = interaction.options.getString("classes", true);
  const member = interaction.member as GuildMember;
  const nameFromMessage = interaction.options.getString("name", true);
  const rolesToBeAssigned: String[] = Array.from(roleNamesToRoles.keys());

  let splitMessage: string[] = classes.split(" ");

  console.log(`\nrole_me call initiated for ${authorUsername}`);
  let rolesToBeAdded: Role[] = [];
  let roleNamesAdded: string[] = [];
  let rolesSkipped: string[] = [];

  if (!roleIsInMemberCache(member, constants.personRole)) {
    rolesToBeAdded.push(roleNamesToRoles.get(constants.personRole)!);
    roleNamesAdded.push(constants.personRole);
  }

  if (!roleIsInMemberCache(member, constants.currentStudentRole)) {
    rolesToBeAdded.push(roleNamesToRoles.get(constants.currentStudentRole)!);
    roleNamesAdded.push(constants.currentStudentRole);
  }

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
      if (!roleIsInMemberCache(member, messageElementUpper)) {
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

  member.roles.add(rolesToBeAdded);
  console.log(`Adding roles [${roleNamesAdded}] to ${authorUsername}`);

  syncUnchangableNameMemberList(client, unchangableNameMemberList);

  let personName = nameFromMessage;
  if (unchangableNameMemberList.includes(authorUsername)) {
    personName = `couldn't change nickname to "${nameFromMessage}", role is above the bot`;
  } else {
    member.setNickname(nameFromMessage);
  }

  await interaction.reply(
    `/role_me ${nameFromMessage} ${classes}\n\n` +
      `username: ${authorUsername}` +
      `\nnickname: ${personName}\nroles added: [${roleNamesAdded}]` +
      `\nroles skipped: [${rolesSkipped}]`
  );
}

function addToClassPrefixList(roleName: String, classPrefixList: String[]) {
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

export function roleIsInMemberCache(
  member: GuildMember,
  roleToCheck: string
): boolean {
  const tempRole = member.roles.cache.find(
    (role: { name: string }) => role.name === roleToCheck
  );
  return tempRole !== undefined;
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
