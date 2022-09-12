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
  unchangeableNameMemberList: string[],
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
        const takeRolesResultString: string = await takeRolesCommand(
          interaction.guild!.members.cache,
          rolesToBeAssigned,
          interaction!.guild!.name
        );
        await interaction.reply(takeRolesResultString);
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
          `unchangeableNameMemberList(updated): [${unchangeableNameMemberList}]\n` +
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
        unchangeableNameMemberList,
        roleNamesToRoles,
        rolesToBeAssigned,
        classPrefixList
      );
    }
  }
}
