import { Client, Role } from "discord.js";
import { updateRolesToBeAssigned } from "../actions/roleActions";

export default (
  client: Client,
  rolesToBeAssigned: string[],
  classPrefixList: string[]
): void => {
  client.on("roleCreate", (role: Role) => {
    updateRolesToBeAssigned(client, rolesToBeAssigned, classPrefixList);
    console.log(`role [${role.name}] added to rolesToBeAssigned list`);
  });
};
