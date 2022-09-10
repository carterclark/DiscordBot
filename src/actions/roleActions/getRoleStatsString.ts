import { CommandInteraction, Role } from "discord.js";
const constants = require("../../constants/constants.json");

export default function getRoleStatsString(
  rolesToBeAssigned: string[],
  interaction: CommandInteraction
) {
  let roleNameToMemberCount: Map<string, number> = new Map();
  let totalClassRoleCount = 0;
  let totalCurrentStudentRoleCount = 0;

  interaction.guild?.roles.cache.forEach((role: Role) => {
    if (
      role.members.size > 0 &&
      rolesToBeAssigned.includes(role.name) &&
      constants.personRole !== role.name &&
      constants.currentStudentRole !== role.name
    ) {
      totalClassRoleCount += role.members.size;
      roleNameToMemberCount.set(role.name, role.members.size);
    }
  });

  totalCurrentStudentRoleCount = interaction.guild?.roles.cache.find(
    (role: Role) => role.name === constants.currentStudentRole
  )?.members.size!;

  let statString =
    `Total: ${totalClassRoleCount} class roles assigned to ` +
    `${totalCurrentStudentRoleCount} students\n`;

  const sortedMap = new Map(
    [...roleNameToMemberCount.entries()].sort((a, b) => b[1] - a[1])
  );

  sortedMap.forEach((value, key) => {
    statString +=
      `${key}:  ${value.valueOf().toString()}` +
      ` = ${((value.valueOf() / totalClassRoleCount) * 100)
        .toFixed(1)
        .toString()}%\n`;
  });
  return statString;
}
