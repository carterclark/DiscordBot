import {
  MessageActionRow,
  MessageSelectMenu,
  MessageSelectOptionData,
} from "discord.js";

const { SlashCommandBuilder } = require("@discordjs/builders");

//Work in Progress , 
// ** should only show with refactored deploy-commands.ts
/**
 * Main issue is that this list is too large for people to look at quickly
 * Something to break these classes into groups would help
 * 
 * Overloading the command is also an option
 * Example ->
 * /role me [Name] [Class]
 * /role me [Name] [Class] [Class]
 * /role me [Name] [Class] [Class] [Class]
 * /role me [Name] [Class] [Class] [Class] [Class]
 */
module.exports = {
  data: new SlashCommandBuilder().setName("roleMe").setDescription("WIP")
  .addStringOption((option :any) =>
  option
    .setName("name")
    .setDescription("Real Name")
    .setRequired(true)
),
  async execute(interaction: any, client: any) {
    const row = new MessageActionRow().addComponents(
      new MessageSelectMenu()
        .setCustomId("classSelect")
        .setPlaceholder("Please Select a Class")
        .setMinValues(1)
        .setMaxValues(5) //This can be anything really, but I wouldn't expect a student to have more than 5
        .addOptions(
            //Instead of creating each option by hand, pull from a list and create the objects at runtime
            //!Not great for efficiency
          classes.map((c: string) => {
            return {
              label: c,
              value: c,
            };
          })
        )
    );
    await interaction.reply({
      content: "Choose Your Classes. ",
      components: row,
    });
  },
};

// This should be a constant somewhere
const classes: string[] = [
  "CFS-262",
  "CFS-264",
  "CFS-280",
  "CFS-345",
  "CFS-380",
  "CFS-484",

  "CYBR-325",
  "CYBR-332",
  "CYBR-362",
  "CYBR-412",
  "CYBR-432",
  "CYBR-442",
  "CYBR-498",
  "CYBR-499",
  "CYBR-621",
  "CYBR-641",
  "CYBR-665",
  "CYBR-690",
  "CYBR-698",

  "DATA-211",
  "DATA-499",

  "ICS-140",
  "ICS-141",
  "ICS-225",
  "ICS-232",
  "ICS-240",
  "ICS-251",
  "ICS-265",
  "ICS-311",
  "ICS-325",
  "ICS-340",
  "ICS-342",
  "ICS-352",
  "ICS-365",
  "ICS-370",
  "ICS-372",
  "ICS-377",
  "ICS-382",
  "ICS-412",
  "ICS-425",
  "ICS-432",
  "ICS-440",
  "ICS-452",
  "ICS-460",
  "ICS-462",
  "ICS-471",
  "ICS-499",
  "ICS-611",
  "ICS-690",

  "MATH-310",
  "MATH-315",
  "MATH-320",
  "MATH-350",
];
