import { Role } from "discord.js";
import insertionSort from "../../util/insertionSort";
const constants = require("../../constants/constants.json");

export default function getRolesSortedString(
  roleNamesToRoles: Map<string, Role>
): String {
  let roleArray: String[] = [];
  let roleString: String = ``;

  roleNamesToRoles.forEach((role: Role) => {
    const roleName = role.name;
    if (
      constants.personRole !== roleName &&
      !constants.topRoles.includes(roleName)
    ) {
      roleArray.push(roleName);
    }
  });
  insertionSort(roleArray as string[]);

  for (const text of roleArray) {
    roleString += `\n` + text;
  }

  return roleString;
}
