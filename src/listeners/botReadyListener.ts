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

    const springCronMessage = `0 0 18 10 1 * *`; // 6PM January 10th
    const summerCronMessage = `0 0 18 14 5 * *`; // 6PM May 14th
    const fallCronMessage = `0 0 18 22 8 * *`; // 6PM August 22nd

    setupScheduledMessage(channelNamesToChannels, springCronMessage);
    setupScheduledMessage(channelNamesToChannels, summerCronMessage);
    setupScheduledMessage(channelNamesToChannels, fallCronMessage);

    const springCronTakeRoles = `0 0 6 1 1 * *`; // 6AM January 1st
    const summerCronTakeRoles = `0 0 6 10 5 * *`; // 6AM May 10th
    const fallCronTakeRoles = `0 0 6 20 8 * *`; // 6AM August 20nd

    setupScheduledTakeRoles(
      server,
      rolesToBeAssigned,
      channelNamesToChannels,
      springCronTakeRoles
    );
    setupScheduledTakeRoles(
      server,
      rolesToBeAssigned,
      channelNamesToChannels,
      summerCronTakeRoles
    );
    setupScheduledTakeRoles(
      server,
      rolesToBeAssigned,
      channelNamesToChannels,
      fallCronTakeRoles
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
