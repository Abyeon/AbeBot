const { MessageEmbed } = require('discord.js');

module.exports = {
    name: "rank",
    description: "Tells the user their level in the server.",
    cooldown: 2,

    execute(message, args, client) {
        let guildInfo = client.db.get(`guild_${message.guildId}`);
        let users = guildInfo.users.sort((a, b) => { return b.xp - a.xp });
        let userInfo = guildInfo.users.find(user => user.id == message.author.id);
        let neededXP = Math.ceil(Math.pow((userInfo.level) / 0.4, 2));

        let rank = users.findIndex(e => e.id == userInfo.id) + 1;

        // Set hex color for embed
        let hexColor = "#FFFFFF";
        if (message.guild) {
            if (message.guild.me.displayHexColor != "#000000") {
                hexColor = message.guild.me.displayHexColor;
            }
        }

        let image = message.author.displayAvatarURL();

        console.log(image);

        const embed = new MessageEmbed()
            .setColor(hexColor)
            .setAuthor({name: `${message.member.displayName}'s Rank Card:`})
            .setDescription(`Rank #${rank} / Level ${userInfo.level}\n\n[ XP : ${userInfo.xp} / ${neededXP} ]`)
            .setThumbnail(message.author.displayAvatarURL())
        
        message.reply({embeds: [embed], allowedMentions: { parse: [] } });
    }
}