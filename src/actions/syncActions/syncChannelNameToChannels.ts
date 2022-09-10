import { Guild, Channel } from "discord.js";

export default function syncChannelNameToChannels(
  server: Guild,
  channelNamesToChannels: Map<String, Channel>
) {
  const channelNameList = Array.from(channelNamesToChannels.keys());
  server.channels.cache.forEach((channel: any) => {
    if (!channelNameList.includes(channel.name)) {
      channelNamesToChannels.set(channel.name, channel);
    }
  });
}
