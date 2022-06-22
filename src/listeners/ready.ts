import { Client, TextChannel } from "discord.js";
import * as dotenv from "dotenv";
import { updateRolesToBeAssigned } from "../actions/roleActions";
import { updateUnchangableNameMemberList } from "../actions/userActions";
dotenv.config();

const channelActions = require(`../actions/channelActions`);
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

    updateUnchangableNameMemberList(client, unchangableNameMemberList);
    updateRolesToBeAssigned(client, rolesToBeAssigned, classPrefixList);

    const server = client.guilds.cache.get(String(process.env.SERVER_ID));
    const logString: string =
      `${client.user.username} initialized on server: ${
        server!.name
      }\nunchangableNameMemberList: [${unchangableNameMemberList}]\nclassPrefixList: [${classPrefixList}]` +
      `\nrolesToBeAssigned: [${rolesToBeAssigned}]`;

    console.log(logString);
    const logChannel: TextChannel = channelActions.findChannelByName(
      constants.botLogChannelName,
      client
    );
    logChannel.send(logString);
  });
};
