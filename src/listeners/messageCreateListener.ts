import { findChannelById } from "../actions/channelActions";
import { findRoleByName, isRolePossessed } from "../actions/roleActions";
import { updateUnchangableNameMemberList } from "../actions/userActions";
import { hasClassPrefix } from "../textParse/textParse";

const constants = require("../constants/constants.json");

export function messageCreate(
  client: any,
  isRoleAssignmentOn: boolean,
  unchangableNameMemberList: string[],
  rolesToBeAssigned: string[],
  classPrefixList: string[]
): void {
  client.on("messageCreate", (message: any) => {
    const channel = findChannelById(message.channelId, client)!;

    // console.log(`message.mentions: ${message.mentions.roles.}`); later stuff to test Carter
    if (channel.name === constants.authChannelName && isRoleAssignmentOn) {
      let splitMessage: string[] = message.content
        .split(",")
        .join("")
        .split(` `);
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
          let startTime = Date.now();
          console.log(`Role call initiated for ${message.author.username}`);

          //check is a moderator call
          updateUnchangableNameMemberList(client, unchangableNameMemberList);

          // to insure the first element is the persons name and not a class
          if (
            !rolesToBeAssigned.includes(splitMessage.at(0)!) &&
            !hasClassPrefix(splitMessage.at(0)!, classPrefixList)
          ) {
            let personName = ``;
            let rolesAdded: any[] = [];
            let rolesSkipped: any[] = [];
            let currentlyReadingName = true;

            for (const messageElement of splitMessage) {
              // if the element matches a role name with case
              // REMINDER: this is needed to read in the Person role
              if (rolesToBeAssigned.includes(messageElement)) {
                currentlyReadingName = false;
                let role = findRoleByName(messageElement, client)!;

                if (
                  !isRolePossessed(
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
                let role = findRoleByName(
                  messageElement.toUpperCase(),
                  client
                )!;

                if (
                  !isRolePossessed(
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
              } else if (hasClassPrefix(messageElement, classPrefixList)) {
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
}

module.exports = { messageCreate };
