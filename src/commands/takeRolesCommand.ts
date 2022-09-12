import { Collection, GuildMember, Role } from "discord.js";
const constants = require("../constants/constants.json");

export default async function takeRolesCommand(
  membersCache: Collection<string, GuildMember>,
  rolesToBeAssigned: string[],
  serverName: string
): Promise<string> {
  let classRoleTakenCount = 0;
  let userWithRoleTakenCount = 0;
  let userNotCounted: boolean;
  let rolesToBeRemoved: Role[] = [];
  let rolesRemovedNames: string[] = [];

  membersCache.forEach((member: GuildMember) => {
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

  return (
    `take_roles removed ${classRoleTakenCount} class roles from ${userWithRoleTakenCount} users` +
    ` in ${serverName}`
  );
}
