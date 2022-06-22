import { Client, TextChannel } from "discord.js";

//used to sidestep problems with typescript imports
const constants = require("../constants/constants.json");
const channelActions = require(`../actions/channelActions`);

export default (process: NodeJS.Process, client: Client): void => {
  process.on("uncaughtException", (error) => {
    console.log(error.stack);
    const logChannel: TextChannel = channelActions.findChannelByName(
      constants.botLogChannelName,
      client
    );
    logChannel.send(
      `Something broke, check the logs. \n{${error.name} : ${error.message}}`
    );
  });
};
