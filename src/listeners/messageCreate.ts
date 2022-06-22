import { Channel, Client, Message, TextBasedChannel } from "discord.js";
import { findChannelById } from "../actions/discordActions";

const constants = require("../constants/constants.json");
const discordActions = require(`../actions/discordActions`);
const textParse = require(`../textParse/textParse`);

export default (
  client: Client,
  isRoleAssignmentOn: boolean,
  unchangableNameMemberList: string[],
  rolesToBeAssigned: string[],
  classPrefixList: string[]
): void => {
  client.on("messageCreate", (message: Message) => {
    const channel = findChannelById(message.channelId, client)!;

    // console.log(`message.mentions: ${message.mentions.roles.}`); later stuff to test Carter
    if (channel.name === constants.authChannelName && isRoleAssignmentOn) {
      var splitMessage: string[] = message.content
        .split(",")
        .join("")
        .split(` `);
      if (
        splitMessage.at(0)!.startsWith("<@") &&
        splitMessage.at(0)!.endsWith(">")
      ) {
        var roleId: String = splitMessage.at(0)!;
        roleId = roleId.slice(3, -1);
        const firstElement = message.guild!.roles.cache.find(
          (r) => r.id === roleId!
        )!.name;
        splitMessage.shift(); // get rid of @ call in array
        splitMessage.push(constants.personRole); // so person role gets assigned

        if (firstElement == `Moderator`) {
          let startTime = Date.now();
          console.log(`Role call initiated for ${message.author.username}`);

          //is a moderator call
          discordActions.updateUnchangableNameMemberList(
            client,
            unchangableNameMemberList
          );

          // to insure the first element is the persons name and not a class
          if (
            !rolesToBeAssigned.includes(splitMessage.at(0)!) &&
            !textParse.hasClassPrefix(splitMessage.at(0), classPrefixList)
          ) {
            var personName = ``;
            var rolesAdded: any[] = [];
            var rolesSkipped: any[] = [];
            var currentlyReadingName = true;

            for (const messageElement of splitMessage) {
              // if the element matches a role name with case
              // REMINDER: this is needed to read in the Person role
              if (rolesToBeAssigned.includes(messageElement)) {
                currentlyReadingName = false;
                let role = discordActions.findRoleByName(
                  messageElement,
                  client
                );

                if (
                  !discordActions.isRolePossessed(
                    message.author.username,
                    messageElement,
                    client
                  )
                ) {
                  message.member!.roles.add(role);
                  rolesAdded.push(role.name);
                } else {
                  rolesSkipped.push(role.name);
                }

                // if the element matches a role without case
              } else if (
                rolesToBeAssigned.includes(messageElement.toUpperCase())
              ) {
                currentlyReadingName = false;
                let role = discordActions.findRoleByName(
                  messageElement.toUpperCase(),
                  client
                );

                if (
                  !discordActions.isRolePossessed(
                    message.author.username,
                    messageElement.toUpperCase(),
                    client
                  )
                ) {
                  message.member!.roles.add(role);
                  rolesAdded.push(role.name);
                } else {
                  rolesSkipped.push(role.name);
                }
              } else if (
                textParse.hasClassPrefix(messageElement, classPrefixList)
              ) {
                currentlyReadingName = false;
                rolesSkipped.push(messageElement);
              }

              // if still reading name
              else if (currentlyReadingName) {
                personName += messageElement + ` `;
              }

              // element is after the name but not recongnized as a role
              else {
                rolesSkipped.push(messageElement);
              }
            }

            personName = personName.slice(0, -1);
            if (
              unchangableNameMemberList.includes(message.member!.user.username)
            ) {
              personName = `couldn't change nickname to "${personName}", role is above the bot`;
            } else {
              message.member!.setNickname("");
              message.member!.setNickname(personName);
            }
            message.reply(
              `username: ${message.author.username}` +
                `\nnickname: "${personName}"\nroles added: [${rolesAdded}]` +
                `\nroles skipped: [${rolesSkipped}]`
            );
          } else {
            message.reply(
              `There was a problem reading your message. \nReminder, the format is ${constants.messageRoleFormat}`
            );
          }
        }
      }
    }
  });
};
