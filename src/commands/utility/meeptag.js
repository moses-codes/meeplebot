const { SlashCommandBuilder,
    StringSelectMenuBuilder, StringSelectMenuOptionBuilder,
    ActionRowBuilder,
    // ComponentType,
    // messageLink
    // ButtonBuilder, ButtonStyle, 
} = require('discord.js');

// console.log(createSelectMenuOptions(calculateNextWeek()))

module.exports = {
    cooldown: 5,
    //sets cooldown in seconds
    data: new SlashCommandBuilder()
        .setName('meeptag')
        .setDescription('Tag the folks who voted for the most popular options!'),

    async execute(interaction) {
        const parentChannelId = await interaction.channel.parentId;
        //grab the parentChannel Id from the current interaction obj
        const threadCreationId = await interaction.channel.id;
        //the message the created the thread and the threadID are identical
        const meeplebotId = await interaction.channel.ownerId;
        //grab the meeplebot Id

        const parentChannel = await interaction.client.channels.fetch(parentChannelId);
        //fetch the parent channel by accessing the fetch method 

        const messageCache = await parentChannel.messages.fetch({ limit: 5, cache: false, before: threadCreationId })
            .then(messages => messages.filter(message => message.author.bot === true && message.author.id === meeplebotId && message.interaction === null))
            .catch(error => console.error(error))
        //grab the thread creation message

        let mostPopularChoices = [], messageReactions;//find the most popular time to game from the message.
        for (let message of messageCache) {
            if (message[1].position === 0) messageReactions = message[1];
        }
        messageReactions = await messageReactions.reactions.cache;
        let maximum = 0;

        for (let reaction of messageReactions) {
            if (reaction[1].count > maximum) {
                maximum = reaction[1].count;
                mostPopularChoices = [reaction[1]];
            } else if (reaction[1].count === maximum) {
                mostPopularChoices.push(reaction[1]);
            }
        }

        const popularEmojis = mostPopularChoices.map(choice => choice._emoji.name);
        const membersToTag = new Set();


        for (let choice of mostPopularChoices) {
            const usersMap = await choice.users.fetch();

            for (let user of usersMap) {
                console.log(user)
                if (user[1].bot) continue;
                if (!membersToTag.has(user[1])) {
                    membersToTag.add(user[1]);
                }
            }
        }
        // console.log(membersToTag)

        let meepleGreeting = 'Attention';

        counter = 0;

        membersToTag.forEach((meeple) => {
            console.log('kijiji', meeple)
            // if (membersToTag.size <= 2) {

            //     if (membersToTag.size === 1) {
            //         meepleGreeting += ` <@${meeple[1].id}>!`;
            //     } else {
            //         meepleGreeting += ` <@${meeple[i].id}> and <@${meeple[i + 1].id}>!`;
            //     }
            if (membersToTag.size === 1) {
                meepleGreeting += ` <@${meeple.id}>!`;
            } else if (counter === membersToTag.size - 1) {
                meepleGreeting += ` and <@${meeple.id}>!`
            } else {
                meepleGreeting += ` <@${meeple.id}>`
            }
            counter++;
        });

        let dateChoices = await mostPopularChoices[0].message.content
            .split('For')
            .map((str, i) => {
                if (i === 0) return;
                str = str.trim().split(' react with ');
                return str;
            })
            .filter(e => e !== undefined)
            .map(arr => {
                return {
                    date: arr[0], emoji: `${arr[1].split('')[0]}${arr[1].split('')[1]}`
                }
            })
            .filter(choice => {
                console.log(choice);
                return popularEmojis.includes(choice.emoji);
            })


        if (dateChoices.length === 1) {
            dateChoices = `The most popular choice is ${dateChoices[0].date}`
        } else {
            let result = 'The most popular choices are:\n';
            dateChoices.forEach((choice, index) => {
                if (index === dateChoices.length - 1) {
                    result += `and ${choice.date}.`;
                } else {
                    result += `${choice.date}\n`;
                }

            })
            dateChoices = result;
        }
        console.log(meepleGreeting)
        await interaction.reply(meepleGreeting + '\n' + dateChoices + '.');
    },
};

/*
1213894072595517471
1213894072595517471
*/