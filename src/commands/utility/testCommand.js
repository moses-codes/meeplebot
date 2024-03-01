const { SlashCommandBuilder,
    StringSelectMenuBuilder, StringSelectMenuOptionBuilder,
    ActionRowBuilder,
    ComponentType,
    messageLink
    // ButtonBuilder, ButtonStyle, 
} = require('discord.js');

function calculateNextWeekend() {
    const currentTimeStamp = Date.now();
    const currentDate = new Date(currentTimeStamp);

    // let today = 6;

    let daysUntilSaturday = 6 - currentDate.getDay();
    if (currentDate.getDay() === 6 || currentDate.getDay() === 0) daysUntilSaturday += 7;
    const millisecondsInDay = 24 * 60 * 60 * 1000;

    const nextSaturdayTimeStamp = currentTimeStamp + daysUntilSaturday * millisecondsInDay;
    const nextSaturdayDate = new Date(nextSaturdayTimeStamp);

    // Calculate the timestamp of next Sunday
    const nextSundayTimeStamp = nextSaturdayTimeStamp + millisecondsInDay;
    const nextSundayDate = new Date(nextSundayTimeStamp);

    const nextMondayTimeStamp = nextSundayTimeStamp + millisecondsInDay;
    const nextMondayDate = new Date(nextMondayTimeStamp);

    console.log("Next Saturday:", nextSaturdayDate.toDateString());
    console.log("Next Sunday:", nextSundayDate.toDateString());
    console.log("Next Monday:", nextMondayDate.toDateString());

    return {
        nextSaturday: nextSaturdayDate.toDateString(),
        nextSunday: nextSundayDate.toDateString(),
        nextMonday: nextMondayDate.toDateString(),
    };
}

const dateChoices = calculateNextWeekend();
const dateChoicesArr = [{ name: dateChoices.nextSaturday, value: dateChoices.nextSaturday },
{ name: dateChoices.nextSunday, value: dateChoices.nextSunday },
]

const dateChoicesArrHoliday = [{ name: dateChoices.nextSaturday, value: dateChoices.nextSaturday },
{ name: dateChoices.nextSunday, value: dateChoices.nextSunday },
{ name: dateChoices.nextMonday, value: dateChoices.nextMonday }
]

module.exports = {
    cooldown: 5,
    //sets cooldown in seconds
    data: new SlashCommandBuilder()
        .setName('echo')
        .setDescription('Replies with your input!')
        // add isHoliday functionality
        .addBooleanOption(option =>
            option.setName('holiday')
                .setDescription('Is Monday a Holiday')
                .setRequired(true)
        ),

    async execute(interaction) {

        // const confirm = new ButtonBuilder()
        //     .setCustomId('confirm')
        //     .setLabel('Confirm Date')
        //     .setStyle(ButtonStyle.Primary)

        const select = new StringSelectMenuBuilder()
            .setCustomId('starter')
            .setPlaceholder('Make a selection!')
            .addOptions(
                new StringSelectMenuOptionBuilder()
                    .setLabel('Saturday')
                    .setDescription(dateChoices.nextSaturday)
                    .setValue(dateChoices.nextSaturday),
                new StringSelectMenuOptionBuilder()
                    .setLabel('Sunday')
                    .setDescription(dateChoices.nextSunday)
                    .setValue(dateChoices.nextSunday),
            ).setMinValues(1)
            .setMaxValues(2)
            ;

        const row = new ActionRowBuilder()
            .setComponents(select);

        await interaction.reply({
            content: interaction.options.getString('category'),
            components: [row],
        });

        // const filter = (i) => i.user.id === message.author.id;

        // const collector = response.createMessageComponentCollector({
        //     componentType: ComponentType.StringSelect,
        //     filter
        // });

        // collector.on('collect', (interaction) => {
        //     if (interaction.customId === 'starter') {
        //         console.log(interaction)
        //         interaction.reply("You have submitted a response.")
        //     }
        // })

        // await interaction.reply(interaction.options.getString('category'));
        // console.log(interaction.options)
    },
};