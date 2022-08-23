import { CommandInteraction, Client, Role } from "discord.js";
import {
  syncRolesToBeAssigned,
  takeRoles,
  fetchListOfRolesSorted,
  roleMeCommand,
} from "./roleActions";
import { updateUnchangableNameMemberList } from "./userActions";

const constants = require("../constants/constants.json");

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

export async function secretChannelResponses(
  commandName: String,
  interaction: CommandInteraction,
  client: Client,
  unchangableNameMemberList: string[],
  roleNamesToRoles: Map<string, Role>,
  classPrefixList: string[],
  authorUsername: string
) {
  switch (commandName) {
    case `ping`:
      await interaction.reply(`Pong!`);
      break;

    case `take_roles`: {
      const message = interaction.options.getString("yes_or_no", true);
      if (message.toUpperCase() === `YES`) {
        updateUnchangableNameMemberList(client, unchangableNameMemberList);
        syncRolesToBeAssigned(client, roleNamesToRoles, classPrefixList);
        takeRoles(interaction, roleNamesToRoles);
      } else {
        await interaction.reply(`roles not taken`);
      }

      break;
    }

    case `info`: {
      updateUnchangableNameMemberList(client, unchangableNameMemberList);
      await interaction.reply(
        `Server name: ${interaction.guild!.name}\nServer id: ${
          interaction!.guild!.id
        }\n` +
          `classPrefixList: [${classPrefixList}]\n` +
          `topRoles: [${constants.topRoles}]\n` +
          `unchangableNameMemberList(updated): [${unchangableNameMemberList}]`
      );
      break;
    }
    case `list_roles`: {
      const roleString = fetchListOfRolesSorted(
        interaction!.guild!.roles.cache
      );

      await interaction.reply(`roles listed: ${roleString}`);
      break;
    }
    case `role_me`: {
      roleMeCommand(
        interaction,
        authorUsername,
        client,
        unchangableNameMemberList,
        roleNamesToRoles,
        classPrefixList
      );
    }
  }
}
