import { Client, Role } from "discord.js";

const constants = require("../constants/constants.json");

export default function messageCreateListener(
  client: Client,
  restrictedMentionIdToRoles: Map<string, Role>,
  unchangeableNameMemberList: string[]
): void {
  client.on(`messageCreate`, async (message: any) => {
    const channelName = message.channel.name as string;
    const restrictedMentionIdArray = Array.from(
      restrictedMentionIdToRoles.keys()
    );
    // adding because message shows @everyone for everyone mention but shows ID for other roles mentioned
    restrictedMentionIdArray.push(constants.everyoneRole);
    if (
      !unchangeableNameMemberList.includes(message.author.username) &&
      messageHasRestrictedMention(restrictedMentionIdArray, message.content)
    ) {
      message.delete();
      message.channel.send(
        `${message.author}Looks like you tried to mention a role that will bother allot of people. ` +
          `If you're in a class channel you can @ that class role, otherwise if you want to make ` +
          `an announcement please @ the moderators for help.`
      );
    } else if (
      !message.author.bot &&
      channelName === constants.authChannelName &&
      (message.content.startsWith(`/role_me`) ||
        message.content.startsWith(`<@`))
    ) {
      return message.reply(
        `You need to type out /role_me and then select ` +
          `the role_me command before typing the rest of your message`
      );
    }
  });
}

function messageHasRestrictedMention(
  restrictedMentionIdArray: string[],
  messageContent: string
): boolean {
  for (const restrictedMentionId of restrictedMentionIdArray) {
    if (messageContent.includes(restrictedMentionId)) return true;
  }
  return false;
}
