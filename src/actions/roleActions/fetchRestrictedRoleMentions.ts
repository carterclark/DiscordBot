import { Guild, Role } from "discord.js";
const constants = require("../../constants/constants.json");

export default function fetchRestrictedRoleMentions(
  server: Guild,
  restrictedMentionNameToRoles: Map<string, Role>
) {
  const rolesToBeRestricted: String[] = constants.restrictedRoleNames;

  server?.roles.cache.forEach((role: Role) => {
    if (rolesToBeRestricted.includes(role.name)) {
      restrictedMentionNameToRoles.set(role.id, role);
    }
  });
}
