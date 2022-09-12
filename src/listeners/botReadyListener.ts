import { Channel, Client, Role } from "discord.js";
import syncChannelNameToChannels from "../actions/syncActions/syncChannelNameToChannels";
import syncRolesToBeAssigned from "../actions/syncActions/syncRolesToBeAssigned";
import syncUnchangeableNameMemberList from "../actions/syncActions/syncUnchangeableNameMemberList";
import setupScheduledMessage from "../util/scheduleUtil/setupScheduledMessage";
import fetchRestrictedRoleMentions from "../actions/roleActions/fetchRestrictedRoleMentions";

const constants = require("../constants/constants.json");
const dotenv = require("dotenv");
dotenv.config();

export function ready(
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

    // take roles: January 1st
    const springCron = `0 0 18 10 1 * *`; // Spring Start: January 10th

    // take roles: May 10th
    const summerCron = `0 0 18 14 5 * *`; // Summer Start: May 14th

    // take roles: August 20th
    const fallCron = `0 0 18 22 8 * *`; // Fall Start: Augest 22nd

    setupScheduledMessage(channelNamesToChannels, springCron);
    setupScheduledMessage(channelNamesToChannels, summerCron);
    setupScheduledMessage(channelNamesToChannels, fallCron);
  });
}
