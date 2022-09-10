import { GuildMember } from "discord.js";

export default function roleIsInMemberCache(
  member: GuildMember,
  roleToCheck: string
): boolean {
  const tempRole = member.roles.cache.find(
    (role: { name: string }) => role.name === roleToCheck
  );
  return tempRole !== undefined;
}
