const fs = require('fs');
const { Client, Collection, Intents } = require('discord.js');
const { prefix, token } = require('./config.json');

/* Set-up Gateway Intents */
const botIntents = new Intents();
botIntents.add(Intents.FLAGS.GUILDS);
botIntents.add(Intents.FLAGS.GUILD_BANS);
botIntents.add(Intents.FLAGS.GUILD_MESSAGES);
botIntents.add(Intents.FLAGS.GUILD_MEMBERS);
botIntents.add(Intents.FLAGS.GUILD_PRESENCES);
botIntents.add(Intents.FLAGS.DIRECT_MESSAGES);

const client = new Client({ intents: botIntents });
client.commands = new Collection();
client.cooldowns = new Collection();
client.db = require("quick.db");

/* Register Commands */
const commandFolders = fs.readdirSync('./commands');

for (const folder of commandFolders) {
    const commandFiles = fs.readdirSync(`./commands/${folder}`).filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
        const command = require(`./commands/${folder}/${file}`);
        client.commands.set(command.name, command);
        console.log(`Registered command \"${command.name}\"`)
    }
}

/* Register Events */
const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
    const event = require(`./events/${file}`);

    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args, client));
    } else {
        client.on(event.name, (...args) => {
            try {
                event.execute(...args, client)
            } catch (err) {
                console.error(err); // Professional error handling!
            }
        });
    }
    console.log(`Registered event \"${event.name}\"`);
}

/* Add Log Events */

client.on("error", console.error);
client.on("warn", console.warn);

/* Login */
client.login(token);