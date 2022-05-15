const { MessageEmbed } = require('discord.js');
const { Database, UserData, GuildData } = require('../../utils/database-interface.js')

module.exports = {
    name: "rank",
    description: "Tells the user their level in the server.",
    usage: "(mention)",
    guildOnly: true,
    cooldown: 2,

    async execute(message, args, client) {
        // Pull the guild's data from the DB
        let guildData = await client.db.addGuild(message.guildId);

        // Find what user to get the rank of
        let mentionedUser = (message.mentions.members.size > 0) ? message.mentions.members.first() : message.member;
        let userInfo = guildData.getUserById(mentionedUser.id);

        // In case the user hasnt been saved in the DB yet, return.
        if (!userInfo) {
            message.reply("User doesn't have a rank yet or is a bot.");
            return;
        }

        // Calculate xp needed to level up
        let neededXP = Math.ceil(Math.pow((userInfo.level) / 0.4, 2));
        let rank = guildData.users.findIndex(e => e.id == userInfo.id) + 1;

        // Set hex color for embed
        let hexColor = "#FFFFFF";
        if (message.guild) {
            if (message.guild.me.displayHexColor != "#000000") {
                hexColor = message.guild.me.displayHexColor;
            }
        }

        // Build the embed
        const embed = new MessageEmbed()
            .setColor(hexColor)
            .setAuthor({name: `${mentionedUser.displayName} is level ${userInfo.level}!`})
            .setDescription(`Rank **#${rank}** out of **${guildData.users.length}** members.\n\n[ XP : **${userInfo.xp}** / ${neededXP} ]`)
            .setThumbnail(mentionedUser.displayAvatarURL())
        
        // Send the embed
        message.reply({embeds: [embed], allowedMentions: { parse: [] } });
    }
}