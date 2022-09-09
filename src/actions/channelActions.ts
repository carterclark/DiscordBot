import { CommandInteraction, Client, Role, Guild, Channel } from "discord.js";
import {
  syncRolesToBeAssigned,
  takeRoles,
  getRoleNamesSorted,
  roleMeCommand,
} from "./roleActions";

const constants = require("../constants/constants.json");

export function findChannelByName(channelName: String, client: Client) {
  const server: Guild = client.guilds.cache.get(String(process.env.SERVER_ID))!;

  let channelFound = server!.channels.cache.find(
    (channel: { name: String }) => channel.name === channelName
  );

  return channelFound as any;
}

export function syncChannelNameToChannels(
  server: Guild,
  channelNamesToChannels: Map<String, Channel>
) {
  const channelNameList = Array.from(channelNamesToChannels.keys());
  server.channels.cache.forEach((channel: any) => {
    if (!channelNameList.includes(channel.name)) {
      channelNamesToChannels.set(channel.name, channel);
    }
  });
}

export async function secretChannelResponses(
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
        takeRoles(interaction, rolesToBeAssigned);
      } else {
        await interaction.reply(`roles not taken`);
      }

      break;
    }

    case `info`: {
      const statString = getStatString(rolesToBeAssigned, interaction);

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
        `roles listed: ${getRoleNamesSorted(roleNamesToRoles)}`
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
function getStatString(
  rolesToBeAssigned: string[],
  interaction: CommandInteraction
) {
  let roleNameToMemberCount: Map<string, number> = new Map();
  let totalClassRoleCount = 0;
  let totalCurrentStudentRoleCount = 0;

  interaction.guild?.roles.cache.forEach((role: Role) => {
    if (
      role.members.size > 0 &&
      rolesToBeAssigned.includes(role.name) &&
      constants.personRole !== role.name &&
      constants.currentStudentRole !== role.name
    ) {
      totalClassRoleCount += role.members.size;
      roleNameToMemberCount.set(role.name, role.members.size);
    }
  });

  totalCurrentStudentRoleCount = interaction.guild?.roles.cache.find(
    (role: Role) => role.name === constants.currentStudentRole
  )?.members.size!;

  let statString =
    `Total: ${totalClassRoleCount} class roles assigned to ` +
    `${totalCurrentStudentRoleCount} students\n`;

  const sortedMap = new Map(
    [...roleNameToMemberCount.entries()].sort((a, b) => b[1] - a[1])
  );

  sortedMap.forEach((value, key) => {
    statString +=
      `${key}:  ${value.valueOf().toString()}` +
      ` = ${((value.valueOf() / totalClassRoleCount) * 100)
        .toFixed(1)
        .toString()}%\n`;
  });
  return statString;
}
