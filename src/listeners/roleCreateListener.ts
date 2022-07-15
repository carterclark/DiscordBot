import { updateRolesToBeAssigned } from "../actions/roleActions";

export function roleCreate(
  client: any,
  rolesToBeAssigned: string[],
  classPrefixList: string[]
): void {
  client.on("roleCreate", (role: any) => {
    updateRolesToBeAssigned(client, rolesToBeAssigned, classPrefixList);
    console.log(`role [${role.name}] added to rolesToBeAssigned list`);
  });
}

module.exports = { roleCreate };
