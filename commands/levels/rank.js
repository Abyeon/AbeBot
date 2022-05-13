const { MessageEmbed } = require('discord.js');
const { Database, UserData, GuildData } = require('../../utils/database-interface.js')

module.exports = {
    name: "rank",
    description: "Tells the user their level in the server.",
    usage: "(mention)",
    cooldown: 2,

    async execute(message, args, client) {
        let guildData;

        if (client.db.hasGuild(message.guildId)) {
            guildData = client.db.getGuildById(message.guildId);
        } else {
            guildData = await client.db.addGuild(message.guildId);
        }

        console.log(guildData);
        let mentionedUser = (message.mentions.members.size > 0) ? message.mentions.members.first() : message.member;

        //let userInfo = guildInfo.users.find(user => user.id == mentionedUser.id);
        let userInfo = guildData.getUserById(mentionedUser.id);
        let users = guildData.users;

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

        const embed = new MessageEmbed()
            .setColor(hexColor)
            .setAuthor({name: `${mentionedUser.displayName} is level ${userInfo.level}!`})
            .setDescription(`Rank **#${rank}** out of **${users.length}** members.\n\n[ XP : **${userInfo.xp}** / ${neededXP} ]`)
            .setThumbnail(mentionedUser.displayAvatarURL())
        
        message.reply({embeds: [embed], allowedMentions: { parse: [] } });
    }
}