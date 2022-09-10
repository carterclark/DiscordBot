import { Channel, Client, Guild, Role } from "discord.js";
import { schedule } from "node-cron";
import syncChannelNameToChannels from "../actions/syncActions/syncChannelNameToChannels";
import syncRolesToBeAssigned from "../actions/syncActions/syncRolesToBeAssigned";
import syncUnchangableNameMemberList from "../actions/syncActions/syncUnchangableNameMemberList";

const constants = require("../constants/constants.json");
const dotenv = require("dotenv");
dotenv.config();

export function ready(
  client: Client,
  unchangableNameMemberList: string[],
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

    syncUnchangableNameMemberList(server, unchangableNameMemberList);
    syncRolesToBeAssigned(
      server,
      roleNamesToRoles,
      rolesToBeAssigned,
      classPrefixList
    );
    syncChannelNameToChannels(server, channelNamesToChannels);
    fetchRestrictedMentions(server, restrictedMentionIdToRoles);

    const logString: string =
      `${client.user.username} initialized on server: ${
        server!.name
      }\nunchangableNameMemberList: [${unchangableNameMemberList}]\nclassPrefixList: [${classPrefixList}]` +
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

function setupScheduledMessage(
  channelNamesToChannels: Map<String, Channel>,
  cronString: string
) {
  schedule(
    cronString,
    function scheduledJob() {
      const announcementsChannel: any =
        channelNamesToChannels.get(`announcements`);

      announcementsChannel.send(
        `@everyone Hey guys, this is you're once in a ` +
          `semester reminder to please plug the discord in ` +
          `your classes. We'd appreciate it. 🙏` +
          `\n\nSomething that the mods have done in the past is just pasting the link in the zoom chat.`
      );
    },
    {
      timezone: "America/Mexico_City",
    }
  );
}

function fetchRestrictedMentions(
  server: Guild,
  restrictedMentionNameToRoles: Map<string, Role>
) {
  const rolesToBeRestricted: String[] = constants.restrictedRoleNames;

  server?.roles.cache.forEach((role: Role) => {
    if (rolesToBeRestricted.includes(role.name)) {
      restrictedMentionNameToRoles.set(role.id, role);
    }
  });
}
