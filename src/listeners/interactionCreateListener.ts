import { secretChannelResponses } from "../actions/channelActions";
import { roleMeCommand } from "../actions/roleActions";
import { Client, Role } from "discord.js";

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
    } else if (interaction.isSelectMenu()) {
      //Here is where the selection is listened for
      let classString = "";
      let name = interaction.options.getString('name')
      await interaction.values.forEach(async (value: string) => {
        classString += `${value} `;
      });

      await interaction.reply({ content: `Hello ${name}, you have been added to ${classString}` });
    } else {
      await interaction.reply({
        content: "This command not enabled for this channel",
        ephemeral: true,
      });
    }
  });
}
