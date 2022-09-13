const dotenv = require("dotenv");
dotenv.config();

const { SlashCommandBuilder } = require("@discordjs/builders");
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");

const commands = [
  new SlashCommandBuilder()
    .setName("role_me")
    .setDescription("Roles the user based upon input")
    .addStringOption((option) =>
      option.setName("name").setDescription("Enter your name").setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("classes")
        .setDescription("Enter your classes")
        .setRequired(true)
    ),
  new SlashCommandBuilder()
    .setName("info")
    .setDescription("Gives info about server"),
  new SlashCommandBuilder()
    .setName("list_roles")
    .setDescription("Replies with a sorted list of roles in the server"),
  // new SlashCommandBuilder()
  //   .setName("take_roles")
  //   .setDescription("takes all class roles from everyone")
  //   .addStringOption((option) =>
  //     option.setName("yes_or_no").setDescription("confirm").setRequired(true)
  //   ),
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
