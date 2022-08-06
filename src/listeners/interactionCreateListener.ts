import {
  findChannelById,
  secretChannelResponses,
} from "../actions/channelActions";
import { roleMeCommand } from "../actions/roleActions";
import { Client, Interaction } from "discord.js";

const constants = require("../constants/constants.json");

export function interactionCreate(
  client: Client,
  unchangableNameMemberList: string[],
  isTakeRolesOn: { value: boolean },
  rolesToBeAssigned: string[],
  classPrefixList: string[]
): void {
  client.on(`interactionCreate`, async (interaction: Interaction) => {
    let channelName = findChannelById(interaction.channelId!, client)?.name;
    let authorUsername = interaction.member!.user.username;

    if (!interaction.isCommand() || interaction === null) return;

    const { commandName } = interaction;

    if (
      channelName === constants.authChannelName &&
      commandName === `role_me`
    ) {
      roleMeCommand(
        interaction,
        authorUsername,
        client,
        unchangableNameMemberList,
        rolesToBeAssigned,
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
        isTakeRolesOn,
        client,
        unchangableNameMemberList,
        rolesToBeAssigned,
        classPrefixList,
        authorUsername
      );
    } else {
      await interaction.reply({
        content: "Commands not enabled for this channel",
        ephemeral: true,
      });
    }
  });
}
