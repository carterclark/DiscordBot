import { Channel, Client, Role } from "discord.js";
import syncChannelNameToChannels from "../actions/syncActions/syncChannelNameToChannels";
import syncRolesToBeAssigned from "../actions/syncActions/syncRolesToBeAssigned";
import syncUnchangeableNameMemberList from "../actions/syncActions/syncUnchangeableNameMemberList";
import setupScheduledMessage from "../schedulers/setupScheduledMessage";
import fetchRestrictedRoleMentions from "../actions/roleActions/fetchRestrictedRoleMentions";
import setupScheduledTakeRoles from "../schedulers/setupScheduleTakeRoles";

const constants = require("../constants/constants.json");
const dotenv = require("dotenv");
dotenv.config();

export default function readyListener(
  client: Client,
  unchangeableNameMemberList: string[],
  roleNamesToRoles: Map<string, Role>,
  rolesToBeAssigned: string[],
  classPrefixList: string[],
  restrictedMentionIdToRoles: Map<string, Role>,
  channelNamesToChannels: Map<String, Channel>
): void {
  client.on("ready", async () => {
    if (!client.user || !client.application) {
      return;
    }
    const server = client.guilds.cache.get(String(process.env.SERVER_ID))!;

    syncUnchangeableNameMemberList(server, unchangeableNameMemberList);
    syncRolesToBeAssigned(
      server,
      roleNamesToRoles,
      rolesToBeAssigned,
      classPrefixList
    );
    syncChannelNameToChannels(server, channelNamesToChannels);
    fetchRestrictedRoleMentions(server, restrictedMentionIdToRoles);

    const logString: string =
      `${client.user.username} initialized on server: ${
        server!.name
      }\nunchangeableNameMemberList: [${unchangeableNameMemberList}]\nclassPrefixList: [${classPrefixList}]` +
      `\nrolesToBeAssigned: [${rolesToBeAssigned}]`;

    console.log(logString);
    const logChannel: any = channelNamesToChannels.get(
      constants.botLogChannelName
    );
    logChannel.send(logString);

    setupScheduledMessage(
      channelNamesToChannels,
      constants.cronSchedules.springCronMessage
    );
    setupScheduledMessage(
      channelNamesToChannels,
      constants.cronSchedules.summerCronMessage
    );
    setupScheduledMessage(
      channelNamesToChannels,
      constants.cronSchedules.fallCronMessage
    );

    setupScheduledTakeRoles(
      server,
      rolesToBeAssigned,
      channelNamesToChannels,
      constants.cronSchedules.springCronTakeRoles
    );
    setupScheduledTakeRoles(
      server,
      rolesToBeAssigned,
      channelNamesToChannels,
      constants.cronSchedules.summerCronTakeRoles
    );
    setupScheduledTakeRoles(
      server,
      rolesToBeAssigned,
      channelNamesToChannels,
      constants.cronSchedules.fallCronTakeRoles
    );
  });
}

// Fall End: December 11th
// take roles: January 1st
// Spring Start: January 10th

// Spring End: May 3rd
// take roles: May 10th
// Summer Start: May 14th

// Summer End: August 14th
// take roles: August 20th
// Fall Start: August 22nd
