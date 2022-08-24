import { Client, Role } from "discord.js";
import { findChannelByName } from "../actions/channelActions";
import { syncRolesToBeAssigned } from "../actions/roleActions";
import { syncUnchangableNameMemberList } from "../actions/userActions";

const constants = require("../constants/constants.json");
const dotenv = require("dotenv");
dotenv.config();

export function ready(
  client: Client,
  unchangableNameMemberList: string[],
  roleNamesToRoles: Map<string, Role>,
  classPrefixList: string[],
  restrictedMentionIdToRoles: Map<string, Role>
): void {
  client.on("ready", async () => {
    if (!client.user || !client.application) {
      return;
    }

    syncUnchangableNameMemberList(client, unchangableNameMemberList);
    syncRolesToBeAssigned(client, roleNamesToRoles, classPrefixList);
    fetchRestrictedMentions(client, restrictedMentionIdToRoles);

    const server = client.guilds.cache.get(String(process.env.SERVER_ID));
    const rolesToBeAssigned: String[] = Array.from(roleNamesToRoles.keys());
    const logString: string =
      `${client.user.username} initialized on server: ${
        server!.name
      }\nunchangableNameMemberList: [${unchangableNameMemberList}]\nclassPrefixList: [${classPrefixList}]` +
      `\nrolesToBeAssigned: [${rolesToBeAssigned}]`;

    console.log(logString);
    const logChannel: any = findChannelByName(
      constants.botLogChannelName,
      client
    );
    logChannel.send(logString);
  });
}

function fetchRestrictedMentions(
  client: Client,
  restrictedMentionNameToRoles: Map<string, Role>
) {
  const server = client.guilds.cache.get(String(process.env.SERVER_ID));
  const rolesToBeRestricted: String[] = constants.restrictedRoleNames;

  server?.roles.cache.forEach((role: Role) => {
    if (rolesToBeRestricted.includes(role.name)) {
      restrictedMentionNameToRoles.set(role.id, role);
    }
  });
}
