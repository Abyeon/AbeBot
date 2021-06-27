const fs = require('fs');
const config = require('../../config.json');

module.exports = {
    name: "setprefix",
    description: "Sets the prefix for this current server.",
    guildOnly: true,
    args: true,
    permissions: 'MANAGE_GUILD',
    usage: '[new prefix]',

    execute(message, args) {
        let settings = require('../../settings.json');
        let currPrefix = '';
        let temp = {id: message.channel.guild.id, prefix: args[0]}

        let index = -1;
        settings.guilds.forEach((g, i) => {
            if (g.id == message.channel.guild.id) {
                index = i;
            }
        });

        if (index > -1) {
            currPrefix = settings.guilds[index].prefix;
            settings.guilds[index].prefix = args[0];
        } else {
            currPrefix = config.prefix;
            settings.guilds.push(temp);
        }

        fs.writeFile('./settings.json', JSON.stringify(settings), err => {
            if (err) {
                console.log(err);
            } else {
                message.reply(`Set this server's prefix from \`${currPrefix}\` to \`${args[0]}\``);
            }
        });
    }
}