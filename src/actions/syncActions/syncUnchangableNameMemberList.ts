import { Guild, GuildMember, Role } from "discord.js";
const constants = require("../../constants/constants.json");

export default function syncUnchangableNameMemberList(
  server: Guild,
  unchangableNameMemberList: string[]
) {
  server?.roles.cache.forEach((role: Role) => {
    if (constants.topRoles.includes(role.name)) {
      role.members.forEach((member: GuildMember) => {
        if (!unchangableNameMemberList.includes(member.user.username)) {
          unchangableNameMemberList.push(member.user.username);
        }
      });
    }
  });
}
