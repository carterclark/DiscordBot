const dotenv = require("dotenv");
dotenv.config();

const { Client, Intents } = require(`discord.js`);
const constants = require("./constants/constants.json");
const textParse = require(`./textParse/textParse`);
const discordActions = require(`./actions/discordActions`);
const logHelper = require(`./util/logHelper`);
const commandsHandler = require(`./commands/commandsHandler`);

var rolesToBeAssigned = [];
var unchangableNameMemberList = [];
var classPrefixList = [];
var isRoleAssignmentOn = true;
var isTakeRolesOn = false;
var totalTime = 0;
var callCounter = 0;

const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MEMBERS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_PRESENCES,
  ],
});

process.on("uncaughtException", (error) => {
  console.log(error.stack);
  const logChannel = discordActions.findChannelByName(
    constants.botLogChannelName,
    client
  );
  logChannel.send(
    `Something broke, check the logs. \n{${error.name} : ${error.message}}`
  );
});

client.once(`ready`, () => {
  discordActions.updateUnchangableNameMemberList(
    client,
    constants,
    unchangableNameMemberList
  );
  discordActions.updateRolesToBeAssigned(
    client,
    constants,
    rolesToBeAssigned,
    classPrefixList
  );

  const server = client.guilds.cache.get(process.env.SERVER_ID);

  const logChannel = discordActions.findChannelByName(
    constants.botLogChannelName,
    client
  );

  const logString =
    `DiscordBot initialized on server: ${server.name}\nunchangableNameMemberList: [${unchangableNameMemberList}]\nclassPrefixList: [${classPrefixList}]` +
    `\nrolesToBeAssigned: [${rolesToBeAssigned}]`;
  console.log(logString);
  logChannel.send(logString);
});

client.on("roleCreate", (role) => {
  discordActions.updateRolesToBeAssigned(
    client,
    constants,
    rolesToBeAssigned,
    classPrefixList
  );
  console.log(`role [${role.name}] added to rolesToBeAssigned list`);
});

client.on("messageCreate", (message) => {
  if (
    message.channel.name === constants.authChannelName &&
    isRoleAssignmentOn &&
    !message.author.bot
  ) {
    console.log(
      `\nmessage.mentions.users: ${JSON.stringify(
        message.mentions.roles.name
      )}\n`
    );
    var splitMessage = message.content.split(",").join("").split(` `);
    if (
      splitMessage.at(0).startsWith("<@") &&
      splitMessage.at(0).endsWith(">")
    ) {
      var roleId = splitMessage.at(0);
      roleId = roleId.slice(3, -1);
      const firstElement = message.guild.roles.cache.find(
        (r) => r.id === roleId
      ).name;
      splitMessage.shift(); // get rid of @ call in array
      splitMessage.push(constants.personRole); // so person role gets assigned

      if (firstElement == `Moderator`) {
        let startTime = Date.now();
        console.log(`Role call initiated for ${message.author.username}`);

        //is a moderator call
        discordActions.updateUnchangableNameMemberList(
          client,
          constants,
          unchangableNameMemberList
        );

        // to insure the first element is the persons name and not a class
        if (
          !rolesToBeAssigned.includes(splitMessage.at(0)) &&
          !textParse.hasClassPrefix(splitMessage.at(0), classPrefixList)
        ) {
          var personName = ``;
          var rolesAdded = [];
          var rolesSkipped = [];
          var currentlyReadingName = true;

          for (const messageElement of splitMessage) {
            // if the element matches a role name with case
            // REMINDER: this is needed to read in the Person role
            if (rolesToBeAssigned.includes(messageElement)) {
              currentlyReadingName = false;
              let role = discordActions.findRoleByName(messageElement, client);

              if (
                !discordActions.isRolePossessed(
                  message.author.username,
                  messageElement,
                  client
                )
              ) {
                message.member.roles.add(role);
                rolesAdded.push(role.name);
              } else {
                rolesSkipped.push(role.name);
              }

              // if the element matches a role without case
            } else if (
              rolesToBeAssigned.includes(messageElement.toUpperCase())
            ) {
              currentlyReadingName = false;
              let role = discordActions.findRoleByName(
                messageElement.toUpperCase(),
                client
              );

              if (
                !discordActions.isRolePossessed(
                  message.author.username,
                  messageElement.toUpperCase(),
                  client
                )
              ) {
                message.member.roles.add(role);
                rolesAdded.push(role.name);
              } else {
                rolesSkipped.push(role.name);
              }
            } else if (
              textParse.hasClassPrefix(messageElement, classPrefixList)
            ) {
              currentlyReadingName = false;
              rolesSkipped.push(messageElement);
            }

            // if still reading name
            else if (currentlyReadingName) {
              personName += messageElement + ` `;
            }

            // element is after the name but not recongnized as a role
            else {
              rolesSkipped.push(messageElement);
            }
          }

          personName = personName.slice(0, -1);
          if (unchangableNameMemberList.includes(message.member.displayName)) {
            personName = `couldn't change nickname to "${personName}", role is above the bot`;
          } else {
            message.member.setNickname("");
            message.member.setNickname(personName);
          }
          message.reply(
            `username: ${message.author.username}` +
              `\nnickname: "${personName}"\nroles added: [${rolesAdded}]` +
              `\nroles skipped: [${rolesSkipped}]`
          );
        } else {
          message.reply(
            `There was a problem reading your message. \nReminder, the format is ${constants.messageRoleFormat}`
          );
        }
        logHelper.logTime(startTime, totalTime, callCounter);
      }
    }
  }
});

client.on(`interactionCreate`, async (interaction) => {
  await interaction.reply(`interaction content: ${interaction}`);

  if (!interaction.isCommand()) return;
  else {
    commandsHandler.handleCommands(
      interaction,
      unchangableNameMemberList,
      isRoleAssignmentOn,
      isTakeRolesOn,
      discordActions,
      client,
      rolesToBeAssigned,
      classPrefixList,
      constants
    );
  }
});

client.login(process.env.BOT_AUTH_TOKEN);
