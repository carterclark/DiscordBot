import { interactionCreate } from "./listeners/interactionCreateListener";
import { ready } from "./listeners/botReadyListener";
import { roleUpdate } from "./listeners/roleUpdateListener";
import { uncaughtException } from "./listeners/uncaughtExceptionListener";
import { Client, Intents, Role } from "discord.js";

const dotenv = require("dotenv");
dotenv.config();

let roleNamesToRoles: Map<string, Role> = new Map();
let unchangableNameMemberList: string[] = [];
let classPrefixList: string[] = [];

const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MEMBERS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_PRESENCES,
  ],
});

uncaughtException(process, client);
ready(client, unchangableNameMemberList, roleNamesToRoles, classPrefixList);
roleUpdate(client, roleNamesToRoles, classPrefixList);
interactionCreate(
  client,
  unchangableNameMemberList,
  roleNamesToRoles,
  classPrefixList
);

client.login(process.env.BOT_AUTH_TOKEN);
