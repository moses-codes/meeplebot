const fs = require('node:fs');
const path = require('node:path');
require('dotenv').config();
// console.log(process.env.DISCORDJS_BOT_TOKEN);

const { Client, Collection, Events, GatewayIntentBits, IntentsBitField } = require('discord.js');
const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent
    ]
});

//intentsBitField refers to the content in the GUILD that can be read by the bot

//the term GUILD refers to servers

client.commands = new Collection();
client.cooldowns = new Collection();
//Collections are extensions of the JS Map class

const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = fs.readdirSync(commandsPath);

    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);
        //start a new item in the Collection with the key as the command and the value as the exported module
        if ('data' in command && 'execute' in command) {
            client.commands.set(command.data.name, command);
            //loads the data into the bot
        } else {
            console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
        }
    }
}

const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file);
    const event = require(filePath);
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args));
    } else {
        console.log(event);
        client.on(event.name, (...args) => event.execute(...args));
    }
}


// client.once(Events.ClientReady, readyClient => {
//     console.log(`Ready! Logged in as ${readyClient.user.tag}`);
// });
//the .once method removes the listener as soon as the event is emitted.

client.login(process.env.DISCORDJS_BOT_TOKEN);
//create a connection to the discord api

// client.on(Events.InteractionCreate, async interaction => {
//     if (!interaction.isChatInputCommand()) return;

//     const command = interaction.client.commands.get(interaction.commandName);

//     if (!command) {
//         console.error(`No matching command ${interaction.commandName} was found.`);
//         return;
//     }

//     try {
//         await command.execute(interaction);
//     } catch (error) {
//         console.error(error);
//         if (interaction.replied || interaction.deferred) {
//             await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
//         } else {
//             await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
//         }
//     }

//     console.log(interaction);
// })

