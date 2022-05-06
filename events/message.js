const Discord = require('discord.js');
const { prefix, token, owner } = require('../config.json');

module.exports = {
    name: 'message',
    execute(message, client) {
        //console.log(`${message.guild.name}/#${message.channel.name}/@${message.member.user.username}#${message.member.user.discriminator}: ${message.content}`); // TODO: Make logger
        const settings = require('../settings.json');
        let serverPrefix = prefix;

        // Check to see if in DM, if not, then use default prefix (do nothing)
        if (message.channel.type !== "dm") {
            settings.guilds.forEach((g) => {
                if (!message.author.bot && g.id == message.channel.guild.id) {
                    serverPrefix = g.prefix;
                }
            });
        }        

        if (!message.content.startsWith(serverPrefix) || message.author.bot) return;

        const args = message.content.slice(serverPrefix.length).trim().split(/ +/);
        const commandName = args.shift().toLowerCase();

        const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

        if (!command) return; // If the command does not exist, return.

        // If command is debug and message author is not the owner, return.
        if (command.debug) {
            if (message.author.id != owner) return;
        }

        // Check if in DMs
        if ((command.guildOnly || command.permissions) && message.channel.type === 'dm') {
            return message.reply('Cant execute this command inside DMs!');
        }

        // Check if user has permission to use command
        if (command.permissions) {
            const authorPerms = message.channel.permissionsFor(message.author);
            if (!authorPerms || !authorPerms.has(command.permissions)) {
                return;
            }
        }

        // Check if there are args if required
        if (command.args && !args.length) {
            let reply = `No arguments provided!`;

            if (command.usage) {
                reply += `\nUsage: \`${serverPrefix}${command.name} ${command.usage}`;
            }

            return message.channel.send(reply);
        }

        // Make sure user cant execute a command within cooldown period.
        const { cooldowns } = client;

        if (!cooldowns.has(command.name)) {
            cooldowns.set(command.name, new Discord.Collection());
        }

        const now = Date.now();
        const timestamps = cooldowns.get(command.name);
        const cooldownAmount = (command.cooldown || 3) * 1000;

        if (timestamps.has(message.author.id)) {
            const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

            if (now < expirationTime) {
                const timeLeft = (expirationTime - now) / 1000;
                return message.reply(`please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`);
            }
        }

        timestamps.set(message.author.id, now);
        setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

        try {
            command.execute(message, args);
        } catch (err) {
            console.error(err);
            message.reply('there was an error trying to execute that command.');
        }
    }
}