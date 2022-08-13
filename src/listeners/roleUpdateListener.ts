import { updateRolesToBeAssigned } from "../actions/roleActions";

export function roleUpdate(
  client: any,
  rolesToBeAssigned: string[],
  classPrefixList: string[]
): void {
  client.on("roleUpdate", (role: any) => {
    updateRolesToBeAssigned(client, rolesToBeAssigned, classPrefixList);
    console.log(`role [${role.name}] added to rolesToBeAssigned list`);
  });
}
