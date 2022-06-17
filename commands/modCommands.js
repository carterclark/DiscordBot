async function modCommandsHandler(
  interaction,
  unchangableNameMemberList,
  isRoleAssignmentOn,
  isTakeRolesOn,
  discordActions,
  client,
  rolesToBeAssigned,
  classPrefixList,
  constants
) {
  const { commandName } = interaction;

  switch (commandName) {
    case `role_me`:
      await interaction.reply(
        `This command does not work outside the authorization channel`
      );
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
          constants,
          unchangableNameMemberList
        );
        discordActions.updateRolesToBeAssigned(
          client,
          constants,
          rolesToBeAssigned,
          classPrefixList
        );
        var roleCount = 0;

        interaction.guild.members.cache.forEach((member) => {
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
            `${interaction.guild.name}`
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
        `Server name: ${interaction.guild.name}\nServer id: ${interaction.guild.id}\n` +
          `Channel name: ${interaction.channel.name} \nChannel id: ${interaction.channel.id}\n` +
          `Your tag: ${interaction.user.tag}\nYour id: ${interaction.user.id}\n` +
          `topRoles: [${constants.topRoles}]\n` +
          `unchangableNameMemberList: [${unchangableNameMemberList}]`
      );
      break;
    }
    case `list_roles`: {
      const roleString = discordActions.fetchListOfRolesSorted(
        interaction.guild.roles.cache,
        constants
      );

      await interaction.reply(`roles listed: ${roleString}`);
      break;
    }
  }
}

module.exports = { modCommandsHandler };
