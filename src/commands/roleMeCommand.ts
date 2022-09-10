import { CommandInteraction, Role, GuildMember } from "discord.js";
import roleIsInMemberCache from "../actions/roleActions/roleIsInMemberCache";
import checkAndAddDefaultRoles from "../actions/roleActions/checkAndAddDefaultRoles";
import formatClassNames from "../util/formatClassNames";
import hasClassPrefix from "../util/hasClassPrefix";

export default async function roleMeCommand(
  interaction: CommandInteraction,
  authorUsername: string,
  unchangableNameMemberList: string[],
  roleNamesToRoles: Map<string, Role>,
  rolesToBeAssigned: string[],
  classPrefixList: string[]
) {
  const classes = interaction.options.getString("classes", true);
  const member = interaction.member as GuildMember;
  const nameFromMessage = interaction.options.getString("name", true);

  let splitMessageSpaceSeperated: string[] = classes.split(" ");

  console.log(`\nrole_me call initiated for ${authorUsername}`);
  let rolesToBeAdded: Role[] = [];
  let roleNamesAdded: string[] = [];
  let rolesSkipped: string[] = [];

  checkAndAddDefaultRoles(
    member,
    rolesToBeAdded,
    roleNamesToRoles,
    roleNamesAdded
  );

  let splitMessageCommaSeperated = splitMessageSpaceSeperated
    .join("")
    .split(",");

  // go through and edit every class name without a dash
  formatClassNames(splitMessageCommaSeperated);

  //assign roles
  for (const messageElement of splitMessageCommaSeperated) {
    const messageElementUpper = messageElement.toUpperCase();

    // this is a recognized role
    if (rolesToBeAssigned.includes(messageElementUpper)) {
      let roleToBeAdded: Role = roleNamesToRoles.get(messageElementUpper)!;

      // role is recognized as a role to be assigned and member does not have it
      if (!roleIsInMemberCache(member, messageElementUpper)) {
        rolesToBeAdded.push(roleToBeAdded);
        roleNamesAdded.push(roleToBeAdded.name);
      }

      // this is a recognized role but the member already has it
      else {
        rolesSkipped.push(messageElementUpper);
      }
    }
    // not a recognized role but has a class prefix
    else if (hasClassPrefix(messageElement, classPrefixList)) {
      rolesSkipped.push(messageElementUpper);
    }
    // element is not recognized with a class prefix
    else {
      rolesSkipped.push(messageElement);
    }
  }

  member.roles.add(rolesToBeAdded);
  console.log(`Adding roles [${roleNamesAdded}] to ${authorUsername}`);

  let personName = nameFromMessage;
  if (unchangableNameMemberList.includes(authorUsername)) {
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
