const dotenv = require('dotenv')
dotenv.config();

const { SlashCommandBuilder } = require('@discordjs/builders');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');

const commands = [
    new SlashCommandBuilder().setName('ping').setDescription('Replies with pong!'),
    new SlashCommandBuilder().setName('take_roles').setDescription('takes all class roles from everyone'),
    new SlashCommandBuilder().setName('info').setDescription('Replies with info for server, channel, and user'),
    new SlashCommandBuilder().setName('list_roles').setDescription('Replies with a list of roles in the server'),
    new SlashCommandBuilder().setName('assign_roles_on').setDescription('Turns auto role assignemnt on'),
    new SlashCommandBuilder().setName('assign_roles_off').setDescription('Turns auto role assignemnt off')
]
    .map(command => command.toJSON());

const rest = new REST({ version: '9' }).setToken(process.env.BOT_AUTH_TOKEN);

rest.put(Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.SERVER_ID), { body: commands })
    .then(() => console.log('Successfully registered application commands.'))
    .catch(console.error);