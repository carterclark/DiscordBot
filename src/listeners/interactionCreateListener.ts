import { secretChannelResponses } from "../actions/channelActions";
import { roleMeCommand } from "../actions/roleActions";
import { Client, Role } from "discord.js";
import { syncUnchangableNameMemberList } from "../actions/userActions";

const constants = require("../constants/constants.json");

export function interactionCreate(
  client: Client,
  unchangableNameMemberList: string[],
  roleNamesToRoles: Map<string, Role>,
  classPrefixList: string[]
): void {
  client.on(`interactionCreate`, async (interaction: any) => {
    if (!interaction.isCommand() || interaction === null) return;

    const { commandName } = interaction;
    const channelName = interaction.channel.name;
    const authorUsername = interaction.member.user.username;

    syncUnchangableNameMemberList(client, unchangableNameMemberList);

    if (
      channelName === constants.authChannelName &&
      commandName === constants.roleMeCommand
    ) {
      roleMeCommand(
        interaction,
        authorUsername,
        client,
        unchangableNameMemberList,
        roleNamesToRoles,
        classPrefixList
      );
    } else if (channelName === constants.secretChannelName) {
      if (!unchangableNameMemberList.includes(authorUsername)) {
        await interaction.reply(
          "Commands in this channel are only enabled for mods"
        );
        return;
      }
      secretChannelResponses(
        commandName,
        interaction,
        client,
        unchangableNameMemberList,
        roleNamesToRoles,
        classPrefixList,
        authorUsername
      );
    } else {
      await interaction.reply({
        content: "This command not enabled for this channel",
        ephemeral: true,
      });
    }
  });
}
