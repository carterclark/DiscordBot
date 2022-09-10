import { GuildMember, Role } from "discord.js";
const constants = require("../../constants/constants.json");
import roleIsInMemberCache from "./roleIsInMemberCache";

export default function checkAndAddDefaultRoles(
  member: GuildMember,
  rolesToBeAdded: Role[],
  roleNamesToRoles: Map<string, Role>,
  roleNamesAdded: string[]
) {
  if (!roleIsInMemberCache(member, constants.personRole)) {
    rolesToBeAdded.push(roleNamesToRoles.get(constants.personRole)!);
    roleNamesAdded.push(constants.personRole);
  }

  if (!roleIsInMemberCache(member, constants.currentStudentRole)) {
    rolesToBeAdded.push(roleNamesToRoles.get(constants.currentStudentRole)!);
    roleNamesAdded.push(constants.currentStudentRole);
  }
}
