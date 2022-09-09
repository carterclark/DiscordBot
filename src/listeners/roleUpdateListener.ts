import { Client, Guild, Role } from "discord.js";
import { syncRolesToBeAssigned } from "../actions/roleActions";

export function roleUpdate(
  client: Client,
  roleNamesToRoles: Map<string, Role>,
  rolesToBeAssigned: string[],
  classPrefixList: string[]
): void {
  client.on("roleUpdate", () => {
    const server: Guild = client.guilds.cache.get(
      String(process.env.SERVER_ID)
    )!;
    syncRolesToBeAssigned(
      server,
      roleNamesToRoles,
      rolesToBeAssigned,
      classPrefixList
    );
  });
}
