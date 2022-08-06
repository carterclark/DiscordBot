import { interactionCreate } from "./listeners/interactionCreateListener";
import { messageCreate } from "./listeners/messageCreateListener";
import { ready } from "./listeners/botReadyListener";
import { roleCreate } from "./listeners/roleCreateListener";
import { uncaughtException } from "./listeners/uncaughtExceptionListener";
import { Client, Intents } from "discord.js";

const dotenv = require("dotenv");
dotenv.config();

let rolesToBeAssigned: string[] = [];
let unchangableNameMemberList: string[] = [];
let classPrefixList: string[] = [];
let isTakeRolesOn = { value: false };

const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MEMBERS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_PRESENCES,
  ],
});

uncaughtException(process, client);
ready(client, unchangableNameMemberList, rolesToBeAssigned, classPrefixList);
roleCreate(client, rolesToBeAssigned, classPrefixList);
messageCreate(
  client,
  unchangableNameMemberList,
  rolesToBeAssigned,
  classPrefixList
);
interactionCreate(
  client,
  unchangableNameMemberList,
  isTakeRolesOn,
  rolesToBeAssigned,
  classPrefixList
);

client.login(process.env.BOT_AUTH_TOKEN);
