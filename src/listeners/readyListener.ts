const constants = require("../constants/constants.json");
const channelActions = require(`../actions/channelActions`);
const roleActions = require(`../actions/roleActions`);
const userActions = require(`../actions/userActions`);
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

    userActions.updateUnchangableNameMemberList(
      client,
      unchangableNameMemberList
    );
    roleActions.updateRolesToBeAssigned(
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
    const logChannel: any = channelActions.findChannelByName(
      constants.botLogChannelName,
      client
    );
    logChannel.send(logString);
  });
}

module.exports = { ready };
