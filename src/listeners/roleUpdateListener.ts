import { Role } from "discord.js";
import { syncRolesToBeAssigned } from "../actions/roleActions";

export function roleUpdate(
  client: any,
  roleNamesToRoles: Map<string, Role>,
  classPrefixList: string[]
): void {
  client.on("roleUpdate", () => {
    syncRolesToBeAssigned(client, roleNamesToRoles, classPrefixList);
  });
}
