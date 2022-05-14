const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'help',
    description: 'List all of the commands or info about a specific one.',
    aliases: ['commands'],
    usage: '(command name)',
    cooldown: 1,
    
    async execute(message, args, client) {
        const { commands } = client;

        let guildData = await client.db.addGuild(message.guildId);
        let prefix = guildData.settings.prefix;

        // Set hex color for embed
        let hexColor = "#FFFFFF";
        if (message.guild) {
            if (message.guild.me.displayHexColor != "#000000") {
                hexColor = message.guild.me.displayHexColor;
            }
        }

        // If no args provided, show a list of commands
        if (!args.length) {
            // Jank way of getting array of modules without duplicates
            let modules = commands.map(command => command.module);
            modules = [...new Set(modules)];
            console.log(modules);

            // Initialize embed
            const embed = new MessageEmbed()
                .setColor(hexColor)
                .setTitle('Abe Bot\'s Commands')
                .setDescription(`\`${prefix}help [command name]\` to get info on a specific command!`)
                .setURL('https://github.com/Abyeon/AbeBot')
                .setThumbnail(client.user.displayAvatarURL());

            // Add commands / modules to embed
            modules.forEach(module => {
                // Get commands that are in this module
                let nestedCommands = commands.filter(command => command.module == module);

                // Uppercase first letter in module name
                let moduleUpper = module.charAt(0).toUpperCase() + module.slice(1);

                // Add the module as a field to the embed
                embed.addField(moduleUpper, nestedCommands.map(command => command.name).join(', '));
            });

            return message.reply({embeds: [embed]});
        }

        const name = args[0].toLowerCase();

        const command = commands.get(name) || commands.find(cmd => cmd.aliases && cmd.aliases.includes(name));

        if (!command) {
            return message.reply("not a valid command!");
        }

        let nameUpper = command.name.charAt(0).toUpperCase() + command.name.slice(1);

        const embed = new MessageEmbed()
            .setColor(hexColor)
            .setTitle(`"${nameUpper}" Command Info:`)

        if (command.aliases) embed.addField("Aliases:", command.aliases.join(', '));
        if (command.description) embed.setDescription(command.description);
        if (command.usage) embed.addField("Usages", `${prefix}${command.name} ${command.usage}`);
        if (command.acceptedArguments) embed.addField("Accepted Arguments:", command.acceptedArguments);

        embed.addField("Cooldown:", `${command.cooldown || 3} second(s)`);

        message.reply({embeds: [embed]});
    }
}