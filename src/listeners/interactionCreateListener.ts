import secretChannelCommands from "../commands/secretChannelCommands";
import { Client, Guild, Role } from "discord.js";
import syncUnchangeableNameMemberList from "../actions/syncActions/syncUnchangeableNameMemberList";
import roleMeCommand from "../commands/roleMeCommand";

const constants = require("../constants/constants.json");

export function interactionCreate(
  client: Client,
  unchangeableNameMemberList: string[],
  roleNamesToRoles: Map<string, Role>,
  rolesToBeAssigned: string[],
  classPrefixList: string[]
): void {
  client.on(`interactionCreate`, async (interaction: any) => {
    if (!interaction.isCommand() || interaction === null) return;

    const { commandName } = interaction;
    const channelName = interaction.channel.name;
    const authorUsername: string = interaction.member.user.username;
    const server: Guild = interaction.guild!;

    syncUnchangeableNameMemberList(server, unchangeableNameMemberList);

    if (
      channelName === constants.authChannelName &&
      commandName === constants.roleMeCommand
    ) {
      roleMeCommand(
        interaction,
        authorUsername,
        unchangeableNameMemberList,
        roleNamesToRoles,
        rolesToBeAssigned,
        classPrefixList
      );
    } else if (channelName === constants.secretChannelName) {
      if (!unchangeableNameMemberList.includes(authorUsername)) {
        await interaction.reply(
          "Commands in this channel are only enabled for mods"
        );
        return;
      }
      secretChannelCommands(
        commandName,
        interaction,
        server,
        unchangeableNameMemberList,
        roleNamesToRoles,
        rolesToBeAssigned,
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
