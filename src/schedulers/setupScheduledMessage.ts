import { Channel } from "discord.js";
import { schedule } from "node-cron";
const constants = require("../constants/constants.json");

export default function setupScheduledMessage(
  channelNamesToChannels: Map<String, Channel>,
  cronString: string
) {
  schedule(
    cronString,
    function scheduledJob() {
      const announcementsChannel: any = channelNamesToChannels.get(
        constants.announcementChannelName
      );

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
  console.log(`Scheduled announcement on ${cronString}`);
}
