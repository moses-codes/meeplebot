const { Events, Collection, Client, ApplicationCommandOptionWithChoicesAndAutocompleteMixin
} = require('discord.js');
module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {
        // console.log('the interaction is,', interaction);

        // if (!interaction.isChatInputCommand()) return;
        if (interaction.isChatInputCommand()) {
            const command = interaction.client.commands.get(interaction.commandName);
            const { cooldowns } = interaction.client;
            if (!cooldowns.has(command.data.name)) {
                cooldowns.set(command.data.name, new Collection());
            };

            const now = Date.now();
            const timestamps = cooldowns.get(command.data.name);
            const defaultCooldownDuration = 3;
            const cooldownAmount = (command.cooldown ?? defaultCooldownDuration) * 1_000;


            if (timestamps.has(interaction.user.id)) {
                const expirationTime = timestamps.get(interaction.user.id) + cooldownAmount;
                if (now < expirationTime) {
                    const expiredTimestamp = Math.round(expirationTime / 1_000);
                    return interaction.reply({ content: `Please wait, you are on a cooldown for \`${command.data.name}\`. You can use it again <t:${expiredTimestamp}:R>.`, ephemeral: true });
                }
            }

            timestamps.set(interaction.user.id, now);
            setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);

            if (!command) {
                console.error(`No command matching ${interaction.commandName} was found.`);
                return;
            }

            try {
                await command.execute(interaction);
            } catch (error) {
                console.error(error);
                if (interaction.replied || interaction.deferred) {
                    await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
                } else {
                    await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
                }
            }
        } else if (interaction.isStringSelectMenu()) {
            let dates = interaction.values.sort((a, b) => a - b)
                .map(timestamp => {
                    let currentDate = new Date(Number(timestamp));
                    return `${currentDate.toLocaleDateString('en-US', { weekday: 'long' })} ${currentDate.toLocaleDateString()} `
                })

            try {

                const emojis = ["😊", "🌟", "🍕", "🎉", "🦄", "🌈", "🍦", "🎈", "🚀"];

                function createGameDayReply(dates) {
                    let message = '';
                    for (let i = 0; i < dates.length; i++) {
                        message += `For ${dates[i]}react with ${emojis[i]}.\n`
                    }
                    return message;
                }

                const dateRange = dates.length > 1 ? `${dates[0]} - ${dates[dates.length - 1]}` : `${dates[0]}`;
                const initialMessage = await interaction
                    .reply({ content: `${interaction.user.username} is hosting game night! \n${createGameDayReply(dates)}` })

                const reply = await initialMessage.interaction.fetchReply()

                for (let i = 0; i < dates.length; i++) {
                    reply.react(emojis[i])
                        .catch(console.error)
                }

                const gamingThread = await interaction.client
                    .channels.fetch(interaction.channelId)
                    .then(channel => channel.threads.create({
                        name: `Session: Sometime b/t ${dateRange}`,
                        reason: 'Creating a new gaming session thread.',
                    })
                        .catch(console.error))
                    .catch(console.error);

                // console.log(gamingThread);

                const filter = (reaction, user) => emojis.slice(0, dates.length).includes(reaction.emoji.name) && !user.bot;
                const collector = reply.createReactionCollector({ filter, time: 30_000, dispose: false });

                collector.on('collect', r => {
                    if (emojis.slice(0, dates.length).includes(r.emoji.name)) {
                        addUserToThread(r.users)
                    }
                });

                async function addUserToThread(users) {
                    const usersMap = await users.fetch();
                    const threadMembers = await gamingThread.members.fetch();
                    for (let user of usersMap.keys()) {
                        if (!threadMembers.has(user)) {

                            await gamingThread.members.add(usersMap.get(user))
                                .then(console.log(`Adding ${user} to thread ${gamingThread.name}`))
                                .catch(error => console.error(error))

                        }
                    }
                };

                collector.on('end', collected => console.log(`Collected ${collected.size} items`));


            } catch (error) {
                console.error(error);
                if (interaction.replied || interaction.deferred) {
                    await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
                } else {
                    await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
                }
            }
        }
    },
};