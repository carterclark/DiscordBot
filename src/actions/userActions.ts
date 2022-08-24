import { Client, GuildMember } from "discord.js";

const constants = require("../constants/constants.json");

export function syncUnchangableNameMemberList(
  client: Client,
  unchangableNameMemberList: string[]
) {
  const server = client.guilds.cache.get(String(process.env.SERVER_ID));
  let roleName = ``;
  server!.members.cache.forEach((member: GuildMember) => {
    for (const roleId of member.roles.cache) {
      roleName = server!.roles.cache.get(String(roleId.at(0)))!.name;

      if (
        constants.topRoles.includes(roleName) &&
        !unchangableNameMemberList.includes(member.user.username)
      ) {
        unchangableNameMemberList.push(member.user.username);
        continue;
      }
    }
  });
}
