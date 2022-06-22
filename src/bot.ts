const dotenv = require("dotenv");
dotenv.config();

const { Client, Intents } = require(`discord.js`);
const uncaughtExceptionListener = require(`./listeners/uncaughtExceptionListener`);
const readyListener = require(`./listeners/readyListener`);
const messageCreateListener = require(`./listeners/messageCreateListener`);
const interactionCreateListener = require(`./listeners/interactionCreateListener`);
const roleCreateListener = require(`./listeners/roleCreateListener`);

let rolesToBeAssigned: string[] = [];
let unchangableNameMemberList: string[] = [];
let classPrefixList: string[] = [];
let isRoleAssignmentOn = true;
let isTakeRolesOn = false;

const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MEMBERS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_PRESENCES,
  ],
});

//listeners
uncaughtExceptionListener.uncaughtException(process, client);

readyListener.ready(
  client,
  unchangableNameMemberList,
  rolesToBeAssigned,
  classPrefixList
);

roleCreateListener.roleCreate(client, rolesToBeAssigned, classPrefixList);

messageCreateListener.messageCreate(
  client,
  isRoleAssignmentOn,
  unchangableNameMemberList,
  rolesToBeAssigned,
  classPrefixList
);

interactionCreateListener.interactionCreate(
  client,
  unchangableNameMemberList,
  isRoleAssignmentOn,
  isTakeRolesOn,
  rolesToBeAssigned,
  classPrefixList
);

client.login(process.env.BOT_AUTH_TOKEN);
