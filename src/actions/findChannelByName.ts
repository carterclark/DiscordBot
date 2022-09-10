import { Client, Guild } from "discord.js";

export default function findChannelByName(channelName: String, client: Client) {
  const server: Guild = client.guilds.cache.get(String(process.env.SERVER_ID))!;

  let channelFound = server!.channels.cache.find(
    (channel: { name: String }) => channel.name === channelName
  );

  return channelFound as any;
}
