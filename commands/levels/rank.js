const { MessageEmbed } = require('discord.js');

module.exports = {
    name: "rank",
    description: "Tells the user their level in the server.",
    cooldown: 2,

    execute(message, args, client) {
        let guildInfo = client.db.get(`guild_${message.guildId}`);
        let users = guildInfo.users.sort((a, b) => { return b.xp - a.xp });

        let mentionedUser = (message.mentions.members.size > 0) ? message.mentions.members.first() : message.member;
        console.log(mentionedUser);

        let userInfo = guildInfo.users.find(user => user.id == mentionedUser.id);

        if (!userInfo) {
            message.reply("User doesn't have a rank yet or is a bot.");
            return;
        }

        let neededXP = Math.ceil(Math.pow((userInfo.level) / 0.4, 2));

        let rank = users.findIndex(e => e.id == userInfo.id) + 1;

        // Set hex color for embed
        let hexColor = "#FFFFFF";
        if (message.guild) {
            if (message.guild.me.displayHexColor != "#000000") {
                hexColor = message.guild.me.displayHexColor;
            }
        }

        let image = mentionedUser.displayAvatarURL();

        console.log(image);

        const embed = new MessageEmbed()
            .setColor(hexColor)
            .setAuthor({name: `${mentionedUser.displayName} is level ${userInfo.level}!`})
            .setDescription(`Rank **#${rank}** out of **${users.length}** members.\n\n[ XP : **${userInfo.xp}** / ${neededXP} ]`)
            .setThumbnail(mentionedUser.displayAvatarURL())
        
        message.reply({embeds: [embed], allowedMentions: { parse: [] } });
    }
}