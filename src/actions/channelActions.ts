export function findChannelByName(channelName: String, client: any) {
  let server: any = client.guilds.cache.get(String(process.env.SERVER_ID))!;

  let channelFound = server!.channels.cache.find(
    (channel: { name: String }) => channel.name === channelName
  );

  return channelFound!;
}

export function findChannelById(channelId: string, client: any) {
  let server: any = client.guilds.cache.get(String(process.env.SERVER_ID))!;

  const channelFound = server.channels.cache.get(channelId);

  return channelFound;
}
