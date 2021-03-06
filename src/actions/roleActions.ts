import { insertionSort } from "../textParse/textParse";

const constants = require("../constants/constants.json");

export async function takeRoles(interaction: any, rolesToBeAssigned: string[]) {
  let roleTakenCount = 0;
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
          roleTakenCount++;
          member.roles.remove(role);
          console.log(`removing ${role.name} from ${member.displayName}`);
          if (userNotCounted) {
            userWithRoleTakenCount++;
            userNotCounted = false;
          }
        }
      });
    }
  );

  await interaction.reply(
    `take_roles removed ${roleTakenCount} roles from ${userWithRoleTakenCount} users` +
      ` in ${interaction!.guild!.name}`
  );
}

export function isRolePossessed(
  username: String,
  roleName: String,
  client: any
) {
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
      break;
    }

    prefix += text;
  }
}
