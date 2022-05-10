const Discord = require('discord.js');
const { prefix, owner } = require('../config.json');
const settings = require('../settings.json');

module.exports = {
    name: 'messageCreate',
    execute(message, client) {
        const { cooldowns } = client;

        if (!message.author.bot) {
            if (!message.guild) {
                console.log(`DIRECT MESSAGE/@${message.author.username}#${message.author.discriminator}: ${message.content}`);
            } else {
                console.log(`${message.guild.name}/#${message.channel.name}/@${message.author.username}#${message.author.discriminator}: ${message.content}`);
                
                // Handle leveling stuff
                xp(message, client);
            }
        }
        //console.log(`${message.guild.name}/#${message.channel.name}/@${message.member.user.username}#${message.member.user.discriminator}: ${message.content}`); // TODO: Make logger
        let serverPrefix = prefix;

        // Check to see if in DM, if not, then use default prefix (do nothing)
        if (message.channel.type !== "DM") {
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
            command.execute(message, args, client);
        } catch (err) {
            console.error(err);
            message.reply('there was an error trying to execute that command.');
        }
    }
}

function xp (message, client) {
    let userId = message.author.id;
    
    // Get guild data from database, or if it doesnt exist, create it.
    let guildInfo = client.db.get(`guild_${message.guildId}`) || client.db.set(`guild_${message.guildId}`, { users: [], settings: {} });

    // Find user from guild data, or if they dont exist, add them.
    let users = guildInfo.users;
    let userInfo = users.find(user => user.id == userId)

    // If user has no info yet, generate it
    if (!userInfo) {
        userInfo = {id: userId, xp: 0, level: 1};
    }

    // Add one xp to user.
    userInfo.xp += 1;

    // Calculate new level from added xp.
    let cur_level = userInfo.level;
    let new_level = Math.ceil(0.4 * Math.sqrt(userInfo.xp));

    // Calculate needed xp
    //console.log(cur_level + " " + userInfo.xp);
    //let neededXP = Math.floor(Math.pow(0.4 * cur_level + 1) - userInfo.xp);

    // User leveled up, yay!
    if (new_level > cur_level) {
        userInfo.level = new_level;
        message.channel.send(`${message.author.toString()}, You just advanced to level ${new_level}!`);
    }

    // Now apply all this back to the DB
    users.splice(users.indexOf(user => user.id == userId), 1);
    users.push(userInfo);
    guildInfo.users = users;
    client.db.set(`guild_${message.guildId}`, guildInfo);
}