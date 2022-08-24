import {
  CommandInteraction,
  Client,
  Role,
  GuildMember,
  Guild,
} from "discord.js";
import {
  syncRolesToBeAssigned,
  takeRoles,
  getRoleNamesSorted,
  roleMeCommand,
  roleIsInMemberCache,
} from "./roleActions";

const constants = require("../constants/constants.json");

export function findChannelByName(channelName: String, client: Client) {
  let server: Guild = client.guilds.cache.get(String(process.env.SERVER_ID))!;

  let channelFound = server!.channels.cache.find(
    (channel: { name: String }) => channel.name === channelName
  );

  return channelFound as any;
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
        syncRolesToBeAssigned(client, roleNamesToRoles, classPrefixList);
        takeRoles(interaction, roleNamesToRoles);
      } else {
        await interaction.reply(`roles not taken`);
      }

      break;
    }

    case `info`: {
      const statString = getStatString(roleNamesToRoles, interaction);

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
        client,
        unchangableNameMemberList,
        roleNamesToRoles,
        classPrefixList
      );
    }
  }
}
function getStatString(
  roleNamesToRoles: Map<string, Role>,
  interaction: CommandInteraction
) {
  let roleNameToMemberCount: Map<string, number> = new Map();
  let countableRoleNames: string[] = Array.from(roleNamesToRoles.keys());
  let roleNames: Array<string> = [];
  let totalClassRoleCount = 0;
  let totalCurrentStudentRoleCount = 0;
  let currentIndividualRoleCount: number = 0;
  interaction.guild!.members.cache.forEach((member: GuildMember) => {
    if (roleIsInMemberCache(member, constants.currentStudentRole)) {
      totalCurrentStudentRoleCount++;
    }
    member.roles.cache.forEach((role: Role) => {
      if (
        countableRoleNames.includes(role.name) &&
        constants.personRole !== role.name &&
        constants.currentStudentRole !== role.name
      ) {
        totalClassRoleCount++;
        roleNames = Array.from(roleNameToMemberCount.keys());
        if (!roleNames.includes(role.name)) {
          roleNameToMemberCount.set(role.name, 1);
        } else {
          currentIndividualRoleCount = roleNameToMemberCount
            .get(role.name)!
            .valueOf();
          roleNameToMemberCount.set(role.name, ++currentIndividualRoleCount);
        }
      }
    });
  });

  const sortedMap = new Map(
    [...roleNameToMemberCount.entries()].sort((a, b) => b[1] - a[1])
  );
  let statString =
    `Total: ${totalClassRoleCount} class roles assigned to ` +
    `${totalCurrentStudentRoleCount} students\n`;
  sortedMap.forEach((value, key) => {
    statString += `${key}:  ${value.valueOf().toString()} = ${(
      (value.valueOf() / totalClassRoleCount) *
      100
    )
      .toFixed(2)
      .toString()}%\n`;
  });
  return statString;
}
