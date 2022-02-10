const dotenv = require('dotenv')
dotenv.config();

const { Client, Intents } = require(`discord.js`);
const constants = require("./constants.json");

var rolesToBeAssigned = [];
var unchangableNameMemberList = [];
var isRoleAssignmentOn = false;

const client = new Client({
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_PRESENCES]
});

process.on('uncaughtException', (error) => {

    const secretChannel = findChannelByName(constants.botLogChannelName);
    secretChannel.send(`Something broke, check the logs. \n{${error.name} : ${error.message}}`);
    console.log(error.stack);

});

client.once(`ready`, () => {
    const server = client.guilds.cache.get(process.env.SERVER_ID);

    console.log(`DiscordBot initialized on server: ${server.name}`);

    updateUnchangableNameMemberList();
    updateRolesToBeAssigned();

    console.log(`unchangableNameMemberList: ${unchangableNameMemberList}` +
        `\nrolesToBeAssigned: ${rolesToBeAssigned}`);
});

client.on('roleCreate', role => {
    updateRolesToBeAssigned();
    console.log(`role [${role.name}] added to rolesToBeAssigned list`);
})

client.on('messageCreate', message => {

    if (message.channel.name === constants.authChannelName && isRoleAssignmentOn) {

        var splitMessage = message.content.split(',').join('').split(` `);
        if (splitMessage.at(0).startsWith('<@') && splitMessage.at(0).endsWith('>')) {

            var roleId = splitMessage.at(0);
            roleId = roleId.slice(3, -1);
            const firstElement = message.guild.roles.cache.find(r => r.id === roleId).name;
            splitMessage.shift(); // get rid of @ call in array
            splitMessage.push(constants.personRole); // so person role gets assigned

            if (firstElement == `Moderator`) {
                updateUnchangableNameMemberList();
                updateRolesToBeAssigned();

                // to insure the first element is the persons name and not a class
                if (!rolesToBeAssigned.includes(splitMessage.at(0))) {

                    var personName = ``;
                    var rolesAdded = [];
                    var rolesSkipped = [];
                    var currentlyReadingName = true;

                    for (const messageElement of splitMessage) {

                        // if the element matches a role name with case
                        if (rolesToBeAssigned.includes(messageElement)) {
                            currentlyReadingName = false;
                            let role = findRoleByName(messageElement);

                            if (!alreadyHasRole(message.author.username, messageElement)) {
                                message.member.roles.add(role);
                                rolesAdded.push(role.name);
                            } else {
                                rolesSkipped.push(role.name);
                            }

                            // if the element matches a role without case
                        } else if (rolesToBeAssigned.includes(messageElement.toUpperCase())) {
                            currentlyReadingName = false;
                            let role = findRoleByName(messageElement.toUpperCase());

                            if (!alreadyHasRole(message.author.username, messageElement.toUpperCase())) {
                                message.member.roles.add(role);
                                rolesAdded.push(role.name);
                            } else {
                                rolesSkipped.push(role.name);
                            }

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
                        personName = `couldn't change nickname to "${personName}", role is above the bot`
                    } else {
                        message.member.setNickname("");
                        message.member.setNickname(personName);
                    }
                    message.reply(`name: ${message.member.displayName}` +
                        `\nnickname: "${personName}"\nroles added: [${rolesAdded}]` +
                        `\nroles skipped: [${rolesSkipped}]`);
                } else {
                    message.reply(`There was a problem reading your message. \nReminder, the format is ${constants.messageRoleFormat}`);
                }
            }
        }
    }

});

client.on(`interactionCreate`, async interaction => {
    updateUnchangableNameMemberList();
    updateRolesToBeAssigned();

    if (!interaction.isCommand()) return;
    else if (!unchangableNameMemberList.includes(interaction.member.displayName)) {
        await interaction.reply("Commands for me are only enabled for mods");
        return;
    }
    else if (interaction.channel.name != constants.secretChannelName) {
        await interaction.reply("Commands for me are not enabled outside the mod chat");
        return;
    }

    const { commandName } = interaction;

    switch (commandName) {
        case `ping`:
            await interaction.reply(`Pong!`);
            break;

        case `check_assign_roles`:
            await interaction.reply(`isRoleAssignmentOn=${isRoleAssignmentOn}`);
            break;

        case `assign_roles_on`:
            isRoleAssignmentOn = true;
            await interaction.reply(`Bot will assign roles`);
            break;

        case `assign_roles_off`:
            isRoleAssignmentOn = false;
            await interaction.reply(`Bot will not assign roles`);
            break;

        case `take_roles`: {
            var roleCount = 0;

            interaction.guild.members.cache.forEach(member => {
                member.roles.cache.forEach(role => {
                    if (rolesToBeAssigned.includes(role.name) && role.name != constants.personRole) {
                        roleCount++;
                        member.roles.remove(role);
                        console.log(`removing ${role.name} from ${member.displayName}`);
                    }
                })
            });

            await interaction.reply(`take_roles removed ${roleCount} roles from server ` +
                `${interaction.guild.name}`);
            break;
        }

        case `info`: {

            await interaction.reply(
                `Server name: ${interaction.guild.name}\nServer id: ${interaction.guild.id}\n` +
                `Channel name: ${interaction.channel.name} \nChannel id: ${interaction.channel.id}\n` +
                `Your tag: ${interaction.user.tag}\nYour id: ${interaction.user.id}\n` +
                `topRoles: [${constants.topRoles}]\n` +
                `unchangableNameMemberList: [${unchangableNameMemberList}]`


            );
            break;
        }
        case `list_roles`: {
            let roleString = ``;
            interaction.guild.roles.cache.forEach(role => {

                if (constants.everyoneRole !== role.name &&
                    constants.personRole !== role.name &&
                    !constants.topRoles.includes(role.name)) {
                    roleString += `\n` + role.name
                }
            });

            await interaction.reply(`roles listed: ${roleString}`);
            break;
        }
    }
});

client.login(process.env.BOT_AUTH_TOKEN);

//functions for convenience

function alreadyHasRole(username, roleName) {

    const server = client.guilds.cache.get(process.env.SERVER_ID);
    var hasRole = false;

    server.members.cache.forEach(member => {

        if (member.user.username === username) {

            member.roles.cache.forEach(role => {
                if (role.name === roleName) {
                    hasRole = true;
                }
            });
        }

    });


    return hasRole;
}

function findRoleByName(roleName) {
    const server = client.guilds.cache.get(process.env.SERVER_ID);
    let roleFound = server.roles.cache.find(role => role.name === roleName);

    return roleFound;

}

function findChannelByName(channelName) {

    const server = client.guilds.cache.get(process.env.SERVER_ID);
    let channelFound = server.channels.cache.find(channel => channel.name === channelName);

    return channelFound;
}

function updateUnchangableNameMemberList() {

    const server = client.guilds.cache.get(process.env.SERVER_ID);
    var roleName = ``;

    server.members.cache.forEach(member => {
        for (const roleId of member.roles.cache) {

            roleName = server.roles.cache.get(roleId.at(0)).name;

            if (constants.topRoles.includes(roleName) && !unchangableNameMemberList.includes(member.displayName)) {
                unchangableNameMemberList.push(member.displayName);
                continue;
            }
        }
    });
}

function updateRolesToBeAssigned() {
    const server = client.guilds.cache.get(process.env.SERVER_ID);

    server.roles.cache.forEach(role => {
        if (!constants.topRoles.includes(role.name) &&
            !rolesToBeAssigned.includes(role.name) &&
            constants.everyoneRole !== role.name) {
            rolesToBeAssigned.push(role.name);
        }
    });
}