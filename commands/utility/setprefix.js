const fs = require('fs');
const config = require('../../config.json');

module.exports = {
    name: "setprefix",
    description: "Sets the prefix for this current server.",
    guildOnly: true,
    args: true,
    permissions: 'MANAGE_GUILD',
    usage: '[new prefix]',

    async execute(message, args, client) {
        // Check if a prefix was provided
        if (args.length == 0) {
            message.reply('Please provide a prefix!');
            return;
        }

        // Reference the current guild settings
        let guildData = await client.db.addGuild(message.guildId);
        let currentPrefix = guildData.settings.prefix;

        // Set the new prefix
        guildData.settings.prefix = args[0];
        await guildData.save();

        // Finally confirm with a reply
        message.reply(`Set this server's prefix from \`${currentPrefix}\` to \`${args[0]}\``);
    }
}