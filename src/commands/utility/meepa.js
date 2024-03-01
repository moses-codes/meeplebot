/* For fully functional slash commands, there are three important pieces of code that need to be written. They are:

The individual command files, containing their definitions and functionality.
The command handler, which dynamically reads the files and executes the commands.
The command deployment script, to register your slash commands with Discord so they appear in the interface. */

const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    cooldown: 10,
    //sets cooldown in seconds
    data: new SlashCommandBuilder()
        .setName('meepbot')
        .setDescription('Replies with zoosoosoo zoosoosoo.'),
    async execute(interaction) {
        await interaction.reply('zoosoosoo\nzoosoosoo');
    },
};