const textParse = require(`../textParse/textParse`);

function isRolePossessed(username, roleName, client) {
  const server = client.guilds.cache.get(process.env.SERVER_ID);
  var hasRole = false;

  server.members.cache.forEach((member) => {
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

function findRoleByName(roleName, client) {
  const server = client.guilds.cache.get(process.env.SERVER_ID);
  let roleFound = server.roles.cache.find((role) => role.name === roleName);

  return roleFound;
}

function findChannelByName(channelName, client) {
  const server = client.guilds.cache.get(process.env.SERVER_ID);
  console.log(`server: ${server}`);
  let channelFound = server.channels.cache.find(
    (channel) => channel.name === channelName
  );

  return channelFound;
}

function updateUnchangableNameMemberList(
  client,
  constants,
  unchangableNameMemberList
) {
  const server = client.guilds.cache.get(process.env.SERVER_ID);
  var roleName = ``;

  server.members.cache.forEach((member) => {
    for (const roleId of member.roles.cache) {
      roleName = server.roles.cache.get(roleId.at(0)).name;

      if (
        constants.topRoles.includes(roleName) &&
        !unchangableNameMemberList.includes(member.displayName)
      ) {
        unchangableNameMemberList.push(member.displayName);
        continue;
      }
    }
  });
}

function updateRolesToBeAssigned(
  client,
  constants,
  rolesToBeAssigned,
  classPrefixList
) {
  const server = client.guilds.cache.get(process.env.SERVER_ID);

  server.roles.cache.forEach((role) => {
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

function addToClassPrefixList(roleName, classPrefixList) {
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

function fetchListOfRolesSorted(rolesCache, constants) {
  let roleArray = [];
  let roleString = ``;

  rolesCache.forEach((role) => {
    if (
      constants.everyoneRole !== role.name &&
      constants.personRole !== role.name &&
      !constants.topRoles.includes(role.name)
    ) {
      roleArray.push(role.name);
    }
  });
  textParse.insertionSort(roleArray);

  for (const text of roleArray) {
    roleString += `\n` + text;
  }

  return roleString;
}

module.exports = {
  isRolePossessed,
  findRoleByName,
  findChannelByName,
  updateUnchangableNameMemberList,
  updateRolesToBeAssigned,
  fetchListOfRolesSorted,
};
