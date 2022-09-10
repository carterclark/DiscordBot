import { CommandInteraction, Role, Guild } from "discord.js";
import roleMeCommand from "./roleMeCommand";
import getRolesSortedString from "../actions/roleActions/getRolesSortedString";
import syncRolesToBeAssigned from "../actions/syncActions/syncRolesToBeAssigned";
const constants = require("../constants/constants.json");
import getRoleStatsString from "../actions/roleActions/getRoleStatsString";
import takeRolesCommand from "./takeRolesCommand";

export default async function secretChannelCommands(
  commandName: String,
  interaction: CommandInteraction,
  server: Guild,
  unchangableNameMemberList: string[],
  roleNamesToRoles: Map<string, Role>,
  rolesToBeAssigned: string[],
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
        syncRolesToBeAssigned(
          server,
          roleNamesToRoles,
          rolesToBeAssigned,
          classPrefixList
        );
        takeRolesCommand(interaction, rolesToBeAssigned);
      } else {
        await interaction.reply(`roles not taken`);
      }

      break;
    }

    case `info`: {
      const statString = getRoleStatsString(rolesToBeAssigned, interaction);

      await interaction.reply(
        `classPrefixList: [${classPrefixList}]\n` +
          `topRoles: [${constants.topRoles}]\n` +
          `unchangableNameMemberList(updated): [${unchangableNameMemberList}]\n` +
          `ROLE STATS\n${statString}`
      );
      break;
    }
    case `list_roles`: {
      await interaction.reply(
        `roles listed: ${getRolesSortedString(roleNamesToRoles)}`
      );
      break;
    }
    case `role_me`: {
      roleMeCommand(
        interaction,
        authorUsername,
        unchangableNameMemberList,
        roleNamesToRoles,
        rolesToBeAssigned,
        classPrefixList
      );
    }
  }
}
