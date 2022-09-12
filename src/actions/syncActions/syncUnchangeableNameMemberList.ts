import { Guild, GuildMember, Role } from "discord.js";
const constants = require("../../constants/constants.json");

export default function syncUnchangeableNameMemberList(
  server: Guild,
  unchangeableNameMemberList: string[]
) {
  server?.roles.cache.forEach((role: Role) => {
    if (constants.topRoles.includes(role.name)) {
      role.members.forEach((member: GuildMember) => {
        if (!unchangeableNameMemberList.includes(member.user.username)) {
          unchangeableNameMemberList.push(member.user.username);
        }
      });
    }
  });
}
