import { CommandInteraction, Role, GuildMember } from "discord.js";
import roleIsInMemberCache from "../actions/roleActions/roleIsInMemberCache";
import checkAndAddDefaultRoles from "../actions/roleActions/checkAndAddDefaultRoles";
import formatClassNames from "../util/classUtil/formatClassNames";

export default async function roleMeCommand(
  interaction: CommandInteraction,
  authorUsername: string,
  unchangeableNameMemberList: string[],
  roleNamesToRoles: Map<string, Role>,
  rolesToBeAssigned: string[]
) {
  console.log(`\nrole_me call initiated for ${authorUsername}`);

  const classes = interaction.options.getString("classes", true);
  const member = interaction.member as GuildMember;
  const nameFromMessage = interaction.options.getString("name", true);

  let rolesToBeAdded: Role[] = [];
  let roleNamesAdded: string[] = [];
  let rolesSkipped: string[] = [];

  checkAndAddDefaultRoles(
    member,
    rolesToBeAdded,
    roleNamesToRoles,
    roleNamesAdded
  );

  let splitMessageCommaSeparated = classes.split(" ").join("").split(",");

  // go through and edit every class name without a dash
  formatClassNames(splitMessageCommaSeparated);

  //assign roles
  for (const messageElement of splitMessageCommaSeparated) {
    const messageElementUpper = messageElement.toUpperCase();

    // this is a recognized role
    if (rolesToBeAssigned.includes(messageElementUpper)) {
      // role is recognized as a role to be assigned and member does not have it
      if (!roleIsInMemberCache(member, messageElementUpper)) {
        let roleToBeAdded: Role = roleNamesToRoles.get(messageElementUpper)!;
        rolesToBeAdded.push(roleToBeAdded);
        roleNamesAdded.push(roleToBeAdded.name);
      }

      // this is a recognized role but the member already has it
      else {
        rolesSkipped.push(messageElementUpper);
      }
    }
    // element is not recognized as a class in the server index
    else {
      rolesSkipped.push(messageElement);
    }
  }

  member.roles.add(rolesToBeAdded);
  console.log(`Adding roles [${roleNamesAdded}] to ${authorUsername}`);

  let personName = nameFromMessage;
  if (unchangeableNameMemberList.includes(authorUsername)) {
    personName = `couldn't change nickname to "${nameFromMessage}", role is above the bot`;
  } else {
    member.setNickname(nameFromMessage);
  }

  await interaction.reply(
    `/role_me ${nameFromMessage} ${classes}\n\n` +
      `user: ${member}` +
      `\nnickname: ${personName}\nroles added: [${roleNamesAdded}]` +
      `\nroles skipped: [${rolesSkipped}]`
  );
}
