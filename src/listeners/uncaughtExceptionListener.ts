import { Client } from "discord.js";
import { findChannelByName } from "../actions/channelActions";

const constants = require("../constants/constants.json");

export function uncaughtException(
  process: NodeJS.Process,
  client: Client
): void {
  process.on("uncaughtException", (error) => {
    console.log(error.stack);
    const logChannel = findChannelByName(constants.botLogChannelName, client);
    logChannel.send(`Something broke, check the logs.\n${error.stack}`);
  });
}
