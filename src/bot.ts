import { interactionCreate } from "./listeners/interactionCreateListener";
import { ready } from "./listeners/botReadyListener";
import { roleUpdate } from "./listeners/roleUpdateListener";
import { uncaughtException } from "./listeners/uncaughtExceptionListener";
import { Channel, Client, Intents, Role } from "discord.js";
import { messageCreate } from "./listeners/messageCreateListener";

const dotenv = require("dotenv");
dotenv.config();

let roleNamesToRoles: Map<string, Role> = new Map();
let rolesToBeAssigned: string[] = [];
let unchangeableNameMemberList: string[] = [];
let classPrefixList: string[] = [];
let restrictedMentionIdToRoles: Map<string, Role> = new Map();
let channelNamesToChannels: Map<String, Channel> = new Map();

const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MEMBERS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_PRESENCES,
  ],
});

ready(
  client,
  unchangeableNameMemberList,
  roleNamesToRoles,
  rolesToBeAssigned,
  classPrefixList,
  restrictedMentionIdToRoles,
  channelNamesToChannels
);
roleUpdate(client, roleNamesToRoles, rolesToBeAssigned, classPrefixList);
interactionCreate(
  client,
  unchangeableNameMemberList,
  roleNamesToRoles,
  rolesToBeAssigned,
  classPrefixList
);
messageCreate(client, restrictedMentionIdToRoles, unchangeableNameMemberList);

uncaughtException(process, client);
client.login(process.env.BOT_AUTH_TOKEN);
