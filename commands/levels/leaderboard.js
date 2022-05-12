const { MessageEmbed } = require('discord.js');

module.exports = {
    name: "leaderboard",
    aliases: ['ranks'],
    description: "Displays a leaderboard of the server",
    cooldown: 2,

    execute(message, args, client) {
        let guildInfo = client.db.get(`guild_${message.guildId}`);
        let users = guildInfo.users.sort((a, b) => { return b.xp - a.xp });
        let userIds = users.map(user => user.id);

        // Set hex color for embed
        let hexColor = "#FFFFFF";
        if (message.guild) {
            if (message.guild.me.displayHexColor != "#000000") {
                hexColor = message.guild.me.displayHexColor;
            }
        }

        const embed = new MessageEmbed()
            .setColor(hexColor)
            .setTitle(`Leaderboard For ${message.guild.name}:`)

        message.guild.members.fetch({ user: userIds }).then(guildMembers => {
            let list = "";

            let index = 0;
            users.forEach(user => {
                index++;
                list += `**${index}.** <@${guildMembers.find(e => e.id == user.id).user.id}> -- level ${user.level} xp ${user.xp}\n`;
            });

            embed.setDescription(list);
            message.reply({embeds: [embed], allowedMentions: { parse: [] } });
        });
    }
}