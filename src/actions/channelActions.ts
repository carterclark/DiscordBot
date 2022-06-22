import { Client, Guild } from "discord.js";

export function findChannelByName(channelName: String, client: Client) {
  let server: Guild = client.guilds.cache.get(String(process.env.SERVER_ID))!;

  let channelFound = server!.channels.cache.find(
    (channel) => channel.name === channelName
  );

  return channelFound!;
}

export function findChannelById(channelId: string, client: Client) {
  let server: Guild = client.guilds.cache.get(String(process.env.SERVER_ID))!;

  const channelFound = server.channels.cache.get(channelId);

  return channelFound;
}
