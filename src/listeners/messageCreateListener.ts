import { Message } from "discord.js";
import { findChannelById } from "../actions/channelActions";

const constants = require("../constants/constants.json");

export function messageCreate(client: any): void {
  client.on("messageCreate", (message: Message) => {
    const channel = findChannelById(message.channelId, client)!;

    if (channel.name === constants.authChannelName && !message.author.bot) {
      let splitMessage: string[] = message.content
        .split(",")
        .join("")
        .split(` `);
      if (isModeratorCall(splitMessage, message)) {
        message.reply(
          `@moderator is no longer supported, please replace it with "/role_me"\nreminder, the format is ${constants.messageRoleFormat}`
        );
      }
    }
  });
}

function isModeratorCall(splitMessage: string[], message: Message): boolean {
  if (
    splitMessage.at(0)!.startsWith("<@") &&
    splitMessage.at(0)!.endsWith(">")
  ) {
    let roleId: String = splitMessage.at(0)!;
    roleId = roleId.slice(3, -1);
    const firstElement = message.guild!.roles.cache.find(
      (role: { id: String }) => role.id === roleId!
    )!.name;
    splitMessage.shift(); // get rid of @ call in array
    splitMessage.push(constants.personRole); // so person role gets assigned

    if (firstElement == `Moderator`) {
      return true;
    }
  }

  return false;
}

module.exports = { messageCreate };
