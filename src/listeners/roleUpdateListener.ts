import { Role } from "discord.js";
import { updateRolesToBeAssigned } from "../actions/roleActions";

export function roleUpdate(
  client: any,
  rolesToBeAssigned: string[],
  classPrefixList: string[]
): void {
  client.on("roleUpdate", (role: Role) => {
    updateRolesToBeAssigned(client, rolesToBeAssigned, classPrefixList);
  });
}
