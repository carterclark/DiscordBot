const dotenv = require("dotenv");
dotenv.config();

const { SlashCommandBuilder } = require("@discordjs/builders");
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const secretHelper = require("./util/secretHelper");

let botAuthToken;
let clientId;
let serverId;

const commands = [
  new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Replies with pong!"),
  new SlashCommandBuilder()
    .setName("take_roles")
    .setDescription("takes all class roles from everyone"),
  new SlashCommandBuilder()
    .setName("info")
    .setDescription("Replies with info for server, channel, and user"),
  new SlashCommandBuilder()
    .setName("list_roles")
    .setDescription("Replies with a list of roles in the server"),
  new SlashCommandBuilder()
    .setName("enable_assign_roles")
    .setDescription("Turns auto role assignemnt on"),
  new SlashCommandBuilder()
    .setName("disable_assign_roles")
    .setDescription("Turns auto role assignemnt off"),
  new SlashCommandBuilder()
    .setName("check_assign_roles")
    .setDescription("Checks if role assignment is enabled"),
  new SlashCommandBuilder()
    .setName("enable_take_roles")
    .setDescription("Turns take_roles on"),
  new SlashCommandBuilder()
    .setName("disable_take_roles")
    .setDescription("Turns take_roles off"),
  new SlashCommandBuilder()
    .setName("check_take_roles")
    .setDescription("Checks if take_roles command is enabled"),
].map((command) => command.toJSON());

if (process.env.GOOGLE_CLOUD_SHELL === undefined) {
  // is NOT running in google cloud
  botAuthToken = process.env.BOT_AUTH_TOKEN;
  clientId = process.env.CLIENT_ID;
  serverId = process.env.SERVER_ID;
} else {
  // is running in google cloud
  botAuthToken = secretHelper.accessSecretVersion("BOT_AUTH_TOKEN");
  clientId = secretHelper.accessSecretVersion("CLIENT_ID");
  serverId = secretHelper.accessSecretVersion("SERVER_ID");
}

const rest = new REST({ version: "9" }).setToken(botAuthToken);

rest
  .put(Routes.applicationGuildCommands(clientId, serverId), {
    body: commands,
  })
  .then(() => console.log("Successfully registered application commands."))
  .catch(console.error);
