import { Client } from "discord.js";

const constants = require("../constants/constants.json");

export function messageCreate(client: Client): void {
  client.on(`messageCreate`, async (message: any) => {
    const channelName = message.channel.name as string;
    if (
      !message.author.bot &&
      channelName === constants.authChannelName &&
      message.content.startsWith(`/role_me`)
    ) {
      await message.reply(
        `You need to type out role_me and then select ` +
          `the role_me command before typing the rest of your message`
      );
    }
  });
}
