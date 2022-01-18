const dotenv = require('dotenv')
dotenv.config();

const { Client, Intents } = require(`discord.js`);
const express = require('express');

let port = process.env.PORT;
if (port == null || port == ``) {
    port = 8080;
}

var app = express();
app.listen(port, function () {
    console.log(`Express server listening on port ${port}`);
});

// const classList = [`ICS-140`, `ICS-141`, `ICS-225`, `ICS-232`, `ICS-240`, `ICS-251`, `ICS-265`, `MATH-310`, `ICS-
// ICS-311`, `ICS-325`, `CYBER-332`, `ICS-340`,
//     `MATH-350`, `ICS-352`, `CYBER-362`, `ICS-365`, `ICS-370`, `ICS-372`, `ICS-382`, `CYBER-412`, 
// `ICS-425`, `ICS-432`, `ICS-440`, `CYBER-442`, `ICS-452`, `ICS-460`, `ICS-462`, `ICS-471`, `CYBER-498`,
//     `CYBER-499`, `ICS-499`, `ICS-611`, `CYBER-621`, `CYBER-641`, `CYBER-698`];

var rolesToBeChanged = [];
var membersNotToChange = [];
// var membersToChange = [];
const topRoles = [`KING`, `Server Booster`, `Industry Expert`, `Moderator`, `dev_boy`];
const commonRoles = [`Person`, `@everyone`];

const client = new Client({
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_PRESENCES]
});

client.once(`ready`, () => {
    console.log(`DiscordBot initialized\nFetching member list`);

    const server = client.guilds.cache.get(process.env.GUILD_ID);

    var roleName = ``;
    server.members.cache.forEach(member => {
        // console.log(`looking at member: ${member.displayName}`);
        for (const roleId of member.roles.cache) {

            roleName = server.roles.cache.get(roleId.at(0)).name;
            // console.log(`role name: ${roleName}, role id: ${roleId.at(0)}`);

            if (topRoles.includes(roleName)) {
                membersNotToChange.push(member.displayName);
                // console.log(`member added to no change list: ${member.displayName}`);
                continue;
            }
        }
    });

    server.roles.cache.forEach(role => {
        if (!topRoles.includes(role.name) && !commonRoles.includes(role.name)) {
            rolesToBeChanged.push(role.name);
            // console.log(`role added to list to be changed: ${role.name}`);
        }
    });

    console.log(`Completed list creations\n${membersNotToChange}\n${rolesToBeChanged}`);
});

client.on('messageCreate', message => {

    if (message.author.username != `Carters_third_born`) {

        var splitMessage = message.content.split(',').join('').split(` `);

        if (splitMessage.at(0).startsWith('<@') && splitMessage.at(0).endsWith('>')) {

            var roleId = splitMessage.at(0);
            roleId = roleId.slice(3, -1);
            const roleName = message.guild.roles.cache.find(r => r.id === roleId).name;
            splitMessage.shift(); // get rid of @moderator in array

            if (roleName == `Moderator`) {

                var personName = ``;
                var rolesAdded = ``;
                for (const messageElement of splitMessage) {

                    if (rolesToBeChanged.includes(messageElement)) {
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
            }
        }
    }
});

client.on(`interactionCreate`, async interaction => {
    if (!interaction.isCommand()) return;

    const { commandName } = interaction;

    switch (commandName) {
        case `ping`:
            await interaction.reply(`Pong!`);
            break;

        case `take_roles`: {
            var roleCount = 0;

            interaction.guild.members.cache.forEach(member => {
                member.roles.cache.forEach(role => {
                    if (rolesToBeChanged.includes(role.name)) {
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