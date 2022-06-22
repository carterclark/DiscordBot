import { Client, Interaction } from "discord.js";
import { updateUnchangableNameMemberList } from "../actions/userActions";
import { findChannelById } from "../actions/channelActions";
import {
  fetchListOfRolesSorted,
  takeRoles,
  updateRolesToBeAssigned,
} from "../actions/roleActions";

const constants = require("../constants/constants.json");

export default (
  client: Client,
  unchangableNameMemberList: string[],
  isRoleAssignmentOn: boolean,
  isTakeRolesOn: boolean,
  rolesToBeAssigned: string[],
  classPrefixList: string[]
): void => {
  client.on(`interactionCreate`, async (interaction: Interaction) => {
    if (!interaction.isCommand() || interaction === null) return;
    else if (
      !unchangableNameMemberList.includes(interaction.member!.user.username)
    ) {
      await interaction.reply("Commands for me are only enabled for mods");
      return;
    } else if (
      findChannelById(interaction.channelId, client)?.name !=
      constants.secretChannelName
    ) {
      await interaction.reply(
        "Commands for me are not enabled outside the mod chat"
      );
      return;
    }

    const { commandName } = interaction;

    switch (commandName) {
      case `ping`:
        await interaction.reply(`Pong!`);
        break;

      case `check_assign_roles`:
        await interaction.reply(`isRoleAssignmentOn=${isRoleAssignmentOn}`);
        break;

      case `enable_assign_roles`:
        isRoleAssignmentOn = true;
        await interaction.reply(`Bot will assign roles`);
        break;

      case `disable_assign_roles`:
        isRoleAssignmentOn = false;
        await interaction.reply(`Bot will NOT assign roles`);
        break;

      case `check_take_roles`:
        await interaction.reply(`isTakeRolesOn=${isTakeRolesOn}`);
        break;

      case `enable_take_roles`:
        isTakeRolesOn = true;
        await interaction.reply(`Bot will take roles`);
        break;

      case `disable_take_roles`:
        isTakeRolesOn = false;
        await interaction.reply(`Bot will NOT take roles`);
        break;

      case `take_roles`: {
        if (isTakeRolesOn) {
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
            `Channel name: ${interaction.channel!.isText.name} \nChannel id: ${
              interaction!.channel!.id
            }\n` +
            `Your tag: ${interaction.user.tag}\nYour id: ${interaction.user.id}\n` +
            `topRoles: [${constants.topRoles}]\n` +
            `unchangableNameMemberList: [${unchangableNameMemberList}]`
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
    }
  });
};
