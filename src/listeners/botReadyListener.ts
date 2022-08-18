import { findChannelByName } from "../actions/channelActions";
import { updateRolesToBeAssigned } from "../actions/roleActions";
import { updateUnchangableNameMemberList } from "../actions/userActions";

const constants = require("../constants/constants.json");
const dotenv = require("dotenv");
dotenv.config();

export function ready(
  client: any,
  unchangableNameMemberList: string[],
  rolesToBeAssigned: string[],
  classPrefixList: string[]
): void {
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
    const logChannel: any = findChannelByName(
      constants.botLogChannelName,
      client
    );
    logChannel.send(logString);
  });
}
