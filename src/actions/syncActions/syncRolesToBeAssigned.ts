import { Guild, Role } from "discord.js";
import { addToClassPrefixList } from "../../util/classUtil/addToClassPrefixList";
const constants = require("../../constants/constants.json");

export default function syncRolesToBeAssigned(
  server: Guild,
  roleNamesToRoles: Map<string, Role>,
  rolesToBeAssigned: string[],
  classPrefixList: String[]
) {
  const rolesInMap: String[] = Array.from(roleNamesToRoles.keys());

  server!.roles.cache.forEach((role: Role) => {
    const roleName = role.name;

    if (!rolesInMap.includes(roleName)) {
      roleNamesToRoles.set(roleName, role);
    }

    if (
      !constants.topRoles.includes(roleName) &&
      !rolesToBeAssigned.includes(roleName) &&
      constants.everyoneRole !== roleName &&
      constants.newRoleName !== roleName
    ) {
      rolesToBeAssigned.push(roleName);
      console.log(`role [${roleName}] added to roleNamesToRoles list`);
      addToClassPrefixList(roleName, classPrefixList);
    }
  });
}
