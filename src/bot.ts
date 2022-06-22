import ready from "./listeners/ready";
import * as dotenv from "dotenv";
import messageCreate from "./listeners/messageCreate";
import interactionCreate from "./listeners/interactionCreate";
import roleCreate from "./listeners/roleCreate";
import uncaughtException from "./listeners/uncaughtException";
dotenv.config();

const { Client, Intents } = require(`discord.js`);

var rolesToBeAssigned: string[] = [];
let unchangableNameMemberList: string[] = [];
var classPrefixList: string[] = [];
var isRoleAssignmentOn = true;
var isTakeRolesOn = false;

const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MEMBERS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_PRESENCES,
  ],
});

//listeners
uncaughtException(process, client);

ready(client, unchangableNameMemberList, rolesToBeAssigned, classPrefixList);

roleCreate(client, rolesToBeAssigned, classPrefixList);

messageCreate(
  client,
  isRoleAssignmentOn,
  unchangableNameMemberList,
  rolesToBeAssigned,
  classPrefixList
);

interactionCreate(
  client,
  unchangableNameMemberList,
  isRoleAssignmentOn,
  isTakeRolesOn,
  rolesToBeAssigned,
  classPrefixList
);

client.login(process.env.BOT_AUTH_TOKEN);
