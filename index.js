const dotenv = require('dotenv')
dotenv.config();

const { Client, Intents } = require(`discord.js`);
const constants = require("./constants.json");

var rolesToBeAssigned = [];
var unchangableNameMemberList = [];

const client = new Client({
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_PRESENCES]
});

client.once(`ready`, () => {
    const server = client.guilds.cache.get(process.env.SERVER_ID);

    console.log(`DiscordBot initialized on server: ${server.name}\nCreating lists: `);

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

    server.roles.cache.forEach(role => {
        if (!constants.topRoles.includes(role.name) && constants.everyoneRole != (role.name)) {
            rolesToBeAssigned.push(role.name.toUpperCase());
            // console.log(`role added to list to be changed: ${role.name}`);
        }
    });

    console.log(`Completed list creations\nunchangableNameMemberList: ${unchangableNameMemberList}` +
        `\nrolesToBeAssigned: ${rolesToBeAssigned}`);
});

client.on('messageCreate', message => {

    if (message.channel.name === constants.authChannelName) {

        var splitMessage = message.content.split(',').join('').split(` `);
        if (splitMessage.at(0).startsWith('<@') && splitMessage.at(0).endsWith('>')) {

            var roleId = splitMessage.at(0);
            roleId = roleId.slice(3, -1);
            const firstElement = message.guild.roles.cache.find(r => r.id === roleId).name;
            splitMessage.shift(); // get rid of @moderator in array
            splitMessage.push(constants.personRole);

            if (firstElement == `Moderator`) {
                if (!rolesToBeAssigned.includes(splitMessage.at(0))) {

                    var personName = ``;
                    var rolesAdded = ``;

                    for (const messageElement of splitMessage) {

                        if (rolesToBeAssigned.includes(messageElement.toUpperCase())) {
                            let role = message.guild.roles.cache.find(role => role.name === messageElement);

                            if (!alreadyHasRole(message.author.username, messageElement)) {
                                message.member.roles.add(role);
                                rolesAdded += `, ${role.name}`;
                            }

                        } else {
                            personName += messageElement + ` `;
                        }
                    }

                    if (unchangableNameMemberList.includes(message.member.displayName)) {
                        personName = `[nickname unchanged, role is above the bot]`
                    } else {
                        message.member.setNickname(personName);
                    }
                    message.reply(`name: ${message.member.displayName}` +
                        `\nnickname: ${personName}\nroles added: ${rolesAdded.substring(1)}`);
                } else {
                    message.reply(`There was a problem reading your message. \nReminder, the format is ${constants.messageRoleFormat}`);
                }
            }
        }
    }

});

client.on(`interactionCreate`, async interaction => {

    if (!interaction.isCommand() || !unchangableNameMemberList.includes(interaction.member.displayName)) return;
    else if (interaction.channel.name != constants.secretChannelName) {
        await interaction.reply("Commands for me are not enabled outside the mod chat");
        return;
    }

    const { commandName } = interaction;

    switch (commandName) {
        case `ping`:
            await interaction.reply(`Pong!`);
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
                `\nYour tag: ${interaction.user.tag}\nYour id: ${interaction.user.id}`);
            break;
        }
        case `list_roles`: {
            let roleString = ``;
            interaction.guild.roles.cache.forEach(role => {

                if (role.name != constants.everyoneRole) {
                    roleString += `` + role.name + `, `
                }
            });
            roleString = roleString.slice(0, -2);

            await interaction.reply(`roles listed: \n${roleString}`);
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