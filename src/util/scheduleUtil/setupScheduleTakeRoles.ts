import { Channel } from "discord.js";
import { schedule } from "node-cron";

export default function setupScheduledTakeRoles(
  channelNamesToChannels: Map<String, Channel>,
  cronString: string
) {
  schedule(
    cronString,
    function scheduledJob() {
      const announcementsChannel: any =
        channelNamesToChannels.get(`announcements`);

      // take roles command

      announcementsChannel.send(`Bot removed [] roles from [] people`);
    },
    {
      timezone: "America/Mexico_City",
    }
  );
}
