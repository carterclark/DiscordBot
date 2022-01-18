const dotenv = require('dotenv')
dotenv.config();

const { Client, Intents } = require(`discord.js`);
const express = require('express');
const constants = require("./constants.json");

let port = process.env.PORT;
if (port == null || port == ``) {
    port = 8080;
}

var app = express();
app.listen(port, function () {
    console.log(`Express server listening on port ${port}`);
});

var rolesToBeAssigned = [];
var membersNotToChange = [];
const topRoles = constants.topRoles;
const commonRoles = constants.commonRoles;
const personRole = constants.personRole;

const client = new Client({
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_PRESENCES]
});

client.once(`ready`, () => {
    console.log(`DiscordBot initialized, Creating lists`);

    const server = client.guilds.cache.get(process.env.GUILD_ID);

    var roleName = ``;
    server.members.cache.forEach(member => {
        for (const roleId of member.roles.cache) {

            roleName = server.roles.cache.get(roleId.at(0)).name;

            if (topRoles.includes(roleName) && !membersNotToChange.includes(member.displayName)) {
                membersNotToChange.push(member.displayName);
                continue;
            }
        }
    });

    server.roles.cache.forEach(role => {
        if (!topRoles.includes(role.name) && !commonRoles.includes(role.name)) {
            rolesToBeAssigned.push(role.name);
            // console.log(`role added to list to be changed: ${role.name}`);
        }
    });

    console.log(`Completed list creations\nmembersNotToChange: ${membersNotToChange}\nrolesToBeAssigned: ${rolesToBeAssigned}`);
});

client.on('messageCreate', message => {

    if (!membersNotToChange.includes(message.member.displayName)) {

        var splitMessage = message.content.split(',').join('').split(` `);
        if (splitMessage.at(0).startsWith('<@') && splitMessage.at(0).endsWith('>')) {

            var roleId = splitMessage.at(0);
            roleId = roleId.slice(3, -1);
            const firstElement = message.guild.roles.cache.find(r => r.id === roleId).name;
            splitMessage.shift(); // get rid of @moderator in array
            splitMessage.push(personRole);

            if (firstElement == `Moderator`) {
                if (!rolesToBeAssigned.includes(splitMessage.at(0))) {

                    var personName = ``;
                    var rolesAdded = ``;

                    for (const messageElement of splitMessage) {

                        if (rolesToBeAssigned.includes(messageElement)) {
                            let role = message.guild.roles.cache.find(role => role.name === messageElement);
                            message.member.roles.add(role);
                            rolesAdded += `, ${role.name}`;
                        } else {
                            personName += messageElement + ` `;
                        }
                    }

                    if (membersNotToChange.includes(message.member.displayName)) {
                        personName = `[nickname unchanged, role too high]`
                    } else {
                        message.member.setNickname(personName);
                    }
                    message.reply(`name: ${message.member.displayName}` +
                        `\nnickname: ${personName}\nroles added: ${rolesAdded.substring(1)}`);
                } else {
                    message.reply(`There was a problem with your request. Ask a moderator`);
                }
            }
        }
    }
});

client.on(`interactionCreate`, async interaction => {
    if (!interaction.isCommand() || !membersNotToChange.includes(interaction.member.displayName)) return;

    const { commandName } = interaction;

    switch (commandName) {
        case `ping`:
            await interaction.reply(`Pong!`);
            break;

        case `take_roles`: {
            var roleCount = 0;

            interaction.guild.members.cache.forEach(member => {
                member.roles.cache.forEach(role => {
                    if (rolesToBeAssigned.includes(role.name)) {
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
            let roleString = ``;
            interaction.guild.roles.cache.forEach(role => roleString += `role name: ` + role.name +
                `, role id: ` + role.id + `\n`)

            await interaction.reply(
                `Server name: ${interaction.guild.name}\nServer id: ${interaction.guild.id}\n` +
                `Channel name: ${interaction.channel.name} \nChannel id: ${interaction.channel.id}\n` +
                roleString +
                `\nYour tag: ${interaction.user.tag}\nYour id: ${interaction.user.id}`);
            break;
        }
    }
});

client.login(process.env.BOT_AUTH_TOKEN);