import { Channel, Guild } from "discord.js";
import { schedule } from "node-cron";
import takeRolesCommand from "src/commands/takeRolesCommand";

export default function setupScheduledTakeRoles(
  server: Guild,
  rolesToBeAssigned: string[],
  channelNamesToChannels: Map<String, Channel>,
  cronString: string
) {
  schedule(
    cronString,
    async function scheduledJob() {
      const botLogsChannel: any = channelNamesToChannels.get(`bot-logs`);

      // take roles command
      const takeRolesResultString: string = await takeRolesCommand(
        server.members.cache,
        rolesToBeAssigned,
        server.name
      );

      botLogsChannel.send(takeRolesResultString);
    },
    {
      timezone: "America/Mexico_City",
    }
  );
}
