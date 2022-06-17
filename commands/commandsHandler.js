const modCommands = require(`./modCommands`);
const publicCommands = require(`./publicCommands`);

async function handleCommands(
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
  if (!interaction.isCommand()) return;
  else if (
    interaction.channel.name === constants.secretChannelName &&
    unchangableNameMemberList.includes(interaction.member.displayName)
  ) {
    // is in the mod chat and user is a mod
    modCommands.modCommandsHandler(
      interaction,
      unchangableNameMemberList,
      isRoleAssignmentOn,
      isTakeRolesOn,
      discordActions,
      client,
      rolesToBeAssigned,
      classPrefixList,
      constants
    );
    return;
  } else if (interaction.channel.name === constants.authChannelName) {
    // in the auth chat
    publicCommands.publicCommandHandler(
      interaction,
      unchangableNameMemberList,
      isRoleAssignmentOn,
      isTakeRolesOn,
      discordActions,
      client,
      rolesToBeAssigned,
      classPrefixList,
      constants
    );
    return;
  } else {
    // not in mod or auth chat
    await interaction.reply(
      `Commands for me are not enabled in this channel. Try authorization or mod chat`
    );
    return;
  }
}

module.exports = { handleCommands };
