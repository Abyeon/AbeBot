const { MessageEmbed } = require('discord.js');

module.exports = {
    name: "leaderboard",
    aliases: ['ranks'],
    description: "Displays a leaderboard of the server",
    guildOnly: true,
    cooldown: 2,

    async execute(message, args, client) {
        // Pull the guild's data from the DB
        let guildData = await client.db.addGuild(message.guildId);

        // Reference and sort the users in descending order by XP
        let users = guildData.users;
        users.sort((a, b) => { return b.xp - a.xp });

        // Set hex color for embed
        let hexColor = "#FFFFFF";
        if (message.guild) {
            if (message.guild.me.displayHexColor != "#000000") {
                hexColor = message.guild.me.displayHexColor;
            }
        }

        // Initiate the embed
        const embed = new MessageEmbed()
            .setColor(hexColor)
            .setTitle(`Leaderboard For ${message.guild.name}:`)
        
        // Build the rest of the embed
        let userIds = users.map(user => user.id);
        message.guild.members.fetch({ user: userIds }).then(guildMembers => {
            let list = "";

            for (let index = 0; index < 10 && index < users.length; index++) {
                const user = users[index];
                console.log(user);
                list += `**${index + 1}.** <@${guildMembers.find(e => e.id == user.id).user.id}> -- level ${user.level} xp ${user.xp}\n`;
            }

            embed.setDescription(list);
            message.reply({embeds: [embed], allowedMentions: { parse: [] } });
        });
    }
}