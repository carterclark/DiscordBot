import interactionCreateListener from "./listeners/interactionCreateListener";
import readyListener from "./listeners/botReadyListener";
import roleUpdateListener from "./listeners/roleUpdateListener";
import uncaughtExceptionListener from "./listeners/uncaughtExceptionListener";
import { Channel, Client, Intents, Role } from "discord.js";
import messageCreateListener from "./listeners/messageCreateListener";

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

readyListener(
  client,
  unchangeableNameMemberList,
  roleNamesToRoles,
  rolesToBeAssigned,
  classPrefixList,
  restrictedMentionIdToRoles,
  channelNamesToChannels
);
roleUpdateListener(
  client,
  roleNamesToRoles,
  rolesToBeAssigned,
  classPrefixList
);
interactionCreateListener(
  client,
  unchangeableNameMemberList,
  roleNamesToRoles,
  rolesToBeAssigned,
  classPrefixList
);
messageCreateListener(
  client,
  restrictedMentionIdToRoles,
  unchangeableNameMemberList
);

uncaughtExceptionListener(process, client);
client.login(process.env.BOT_AUTH_TOKEN);
