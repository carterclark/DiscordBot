import { Client, TextChannel } from "discord.js";
import * as dotenv from "dotenv";
dotenv.config();

const discordActions = require(`../actions/discordActions`);
const constants = require("../constants/constants.json");

export default (
  client: Client,
  unchangableNameMemberList: string[],
  rolesToBeAssigned: string[],
  classPrefixList: string[]
): void => {
  client.on("ready", async () => {
    if (!client.user || !client.application) {
      return;
    }

    discordActions.updateUnchangableNameMemberList(
      client,
      unchangableNameMemberList
    );
    discordActions.updateRolesToBeAssigned(
      client,
      rolesToBeAssigned,
      classPrefixList
    );

    const server = client.guilds.cache.get(String(process.env.SERVER_ID));
    const logString: string =
      `${client.user.username} initialized on server: ${
        server!.name
      }\nunchangableNameMemberList: [${unchangableNameMemberList}]\nclassPrefixList: [${classPrefixList}]` +
      `\nrolesToBeAssigned: [${rolesToBeAssigned}]`;

    console.log(logString);
    const logChannel: TextChannel = discordActions.findChannelByName(
      constants.botLogChannelName,
      client
    );
    logChannel.send(logString);
  });
};
