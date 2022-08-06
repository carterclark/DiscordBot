import { CommandInteraction, Client } from "discord.js";
import {
  updateRolesToBeAssigned,
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
  isTakeRolesOn: { value: boolean },
  client: Client,
  unchangableNameMemberList: string[],
  rolesToBeAssigned: string[],
  classPrefixList: string[],
  authorUsername: string
) {
  switch (commandName) {
    case `ping`:
      await interaction.reply(`Pong!`);
      break;

    case `enable_take_roles`:
      isTakeRolesOn.value = true;
      await interaction.reply(`Bot will take roles`);
      break;

    case `disable_take_roles`:
      isTakeRolesOn.value = false;
      await interaction.reply(`Bot will NOT take roles`);
      break;

    case `take_roles`: {
      if (isTakeRolesOn.value) {
        updateUnchangableNameMemberList(client, unchangableNameMemberList);
        updateRolesToBeAssigned(client, rolesToBeAssigned, classPrefixList);
        takeRoles(interaction, rolesToBeAssigned);
      } else {
        await interaction.reply(`take_roles is currently disabled`);
      }

      break;
    }

    case `info`: {
      updateUnchangableNameMemberList(client, unchangableNameMemberList);
      await interaction.reply(
        `Server name: ${interaction!.guild!.name}\nServer id: ${
          interaction!.guild!.id
        }\n` +
          `isTakeRolesOn: ${isTakeRolesOn.value}\n` +
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
        rolesToBeAssigned,
        classPrefixList
      );
    }
  }
}
