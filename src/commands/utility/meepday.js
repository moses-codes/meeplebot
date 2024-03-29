const { SlashCommandBuilder,
    StringSelectMenuBuilder, StringSelectMenuOptionBuilder,
    ActionRowBuilder,
    // ComponentType,
    // messageLink
    // ButtonBuilder, ButtonStyle, 
} = require('discord.js');

function calculateNextWeek() {
    let currentTimeStamp = Date.now();
    let currentDate = new Date(currentTimeStamp);
    const resultWeek = [];

    // let today = 6;

    const millisecondsInDay = 24 * 60 * 60 * 1000;

    let daysUntilSunday;

    if (currentDate.getDay() === 5) {
        daysUntilSunday = 9;
    } else if (currentDate.getDay() === 6) {
        daysUntilSunday = 8;
    } else if (currentDate.getDay() === 0) {
        daysUntilSunday = 7;
    } else {
        daysUntilSunday = 7 - currentDate.getDay();
    }

    for (let i = 0; i <= daysUntilSunday; i++) {
        resultWeek.push(currentTimeStamp)
        currentTimeStamp += millisecondsInDay;
    }
    return resultWeek;
}

function createSelectMenuOptions(timestamps) {
    let result = [];
    for (let timestamp of timestamps) {
        currentDate = new Date(timestamp)
        const choice = new StringSelectMenuOptionBuilder()
            .setLabel(`${currentDate.toLocaleDateString('en-US', { weekday: 'long' })} ${currentDate.toLocaleDateString()}`)
            // .setDescription(`${currentDate.toLocaleDateString()}`)
            .setValue(`${timestamp}`)
        result.push(choice)
    }
    return result;
};

// console.log(createSelectMenuOptions(calculateNextWeek()))

module.exports = {
    cooldown: 5,
    //sets cooldown in seconds
    data: new SlashCommandBuilder()
        .setName('meepday')
        .setDescription('What day(s) do you want to game?'),

    async execute(interaction) {

        if (interaction.channel.isThread()) {
            await interaction.reply({ content: '/meepday can only be used in channels.', ephemeral: true });
        } else {

            const select = new StringSelectMenuBuilder()
                .setCustomId('starter')
                .setPlaceholder('Make a selection!')
                .addOptions(...createSelectMenuOptions(calculateNextWeek())).setMinValues(1)
                .setMaxValues(calculateNextWeek().length);

            const row = new ActionRowBuilder()
                .setComponents(select);

            await interaction.reply({
                content: interaction.options.getString('category'),
                components: [row],
                ephemeral: true
            });

        }
    },
}; 