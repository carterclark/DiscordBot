const dotenv = require("dotenv");
dotenv.config();

const { SlashCommandBuilder } = require("@discordjs/builders");
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");

const commands = [
  new SlashCommandBuilder()
    .setName("role_me")
    .setDescription("Roles the user based upon input"),
  new SlashCommandBuilder()
    .setName("list_roles")
    .setDescription("Replies with a list of roles in the server"),
  new SlashCommandBuilder()
    .setName("check_take_roles")
    .setDescription("Checks if take_roles command is enabled"),
  new SlashCommandBuilder()
    .setName("enable_take_roles")
    .setDescription("Turns take_roles on"),
  new SlashCommandBuilder()
    .setName("disable_take_roles")
    .setDescription("Turns take_roles off"),
  new SlashCommandBuilder()
    .setName("take_roles")
    .setDescription("takes all class roles from everyone"),
].map((command) => command.toJSON());

const rest = new REST({ version: "9" }).setToken(process.env.BOT_AUTH_TOKEN);

rest
  .put(
    Routes.applicationGuildCommands(
      process.env.CLIENT_ID,
      process.env.SERVER_ID
    ),
    { body: commands }
  )
  .then(() => console.log("Successfully registered application commands."))
  .catch(console.error);
