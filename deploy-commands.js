const dotenv = require('dotenv')
dotenv.config();

const { SlashCommandBuilder } = require('@discordjs/builders');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');

const commands = [
    new SlashCommandBuilder().setName('ping').setDescription('Replies with pong!'),
    new SlashCommandBuilder().setName('take_roles').setDescription('takes all class roles from everyone'),
    new SlashCommandBuilder().setName('info').setDescription('Replies with info for server, channel, and user'),
]
    .map(command => command.toJSON());

const rest = new REST({ version: '9' }).setToken(process.env.BOT_AUTH_TOKEN);

rest.put(Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID), { body: commands })
    .then(() => console.log('Successfully registered application commands.'))
    .catch(console.error);