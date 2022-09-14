import { Channel, Guild } from "discord.js";
import { schedule } from "node-cron";
import takeRolesCommand from "../commands/takeRolesCommand";
const constants = require("../constants/constants.json");

export default function setupScheduledTakeRoles(
  server: Guild,
  rolesToBeAssigned: string[],
  channelNamesToChannels: Map<String, Channel>,
  cronString: string
) {
  schedule(
    cronString,
    async function scheduledJob() {
      const announcementsChannel: any = channelNamesToChannels.get(
        constants.announcementChannelName
      );

      // take roles command
      const takeRolesResultString: string = await takeRolesCommand(
        server.members.cache,
        rolesToBeAssigned,
        server.name
      );

      announcementsChannel.send(takeRolesResultString);
    },
    {
      timezone: "America/Mexico_City",
    }
  );
  console.log(`Scheduled take roles on ${cronString}`);
}
