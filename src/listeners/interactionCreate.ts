import { Client, Interaction } from "discord.js";
import { findChannelById } from "../actions/discordActions";

const constants = require("../constants/constants.json");
const discordActions = require(`../actions/discordActions`);

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
          discordActions.updateUnchangableNameMemberList(
            client,
            unchangableNameMemberList
          );
          discordActions.updateRolesToBeAssigned(
            client,
            rolesToBeAssigned,
            classPrefixList
          );
          var roleCount = 0;

          interaction.guild!.members.cache.forEach((member) => {
            member.roles.cache.forEach((role) => {
              if (
                rolesToBeAssigned.includes(role.name) &&
                role.name != constants.personRole
              ) {
                roleCount++;
                member.roles.remove(role);
                console.log(`removing ${role.name} from ${member.displayName}`);
              }
            });
          });

          await interaction.reply(
            `take_roles removed ${roleCount} roles from server ` +
              `${interaction!.guild!.name}`
          );
        } else {
          await interaction.reply(`take_roles is currently disabled`);
        }

        break;
      }

      case `info`: {
        discordActions.updateUnchangableNameMemberList(
          client,
          constants,
          unchangableNameMemberList
        );
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
        const roleString = discordActions.fetchListOfRolesSorted(
          interaction!.guild!.roles.cache,
          constants
        );

        await interaction.reply(`roles listed: ${roleString}`);
        break;
      }
    }
  });
};
