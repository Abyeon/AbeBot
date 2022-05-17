const { MessageEmbed } = require('discord.js');

module.exports = {
    name: "unmute",
    description: "Unmute a user",
    guildOnly: true,
    args: true,
    permissions: 'MUTE_MEMBERS',
    usage: '[user]',

    async execute (message, args) {
        // Find the member specified
        let member = message.mentions.members.first();
        if (!member) {
            let collection = await message.guild.members.fetch({ query: args[0], limit: 1})
            member = collection.first();

            if (!member) return message.channel.send('Not a valid user!');
        }

        // Check if the member is a bot
        if (member.user.bot) {
            return message.reply("Cannot mute bots!");
        }

        // Unmute the member
        member.timeout(null);

        // Build the embed
        const embed = new MessageEmbed({author: {name: `${member.user.tag} is now unmuted`, iconURL: member.user.displayAvatarURL({dynamic: true})}});
        
        // Send it
        message.reply({embeds: [embed]});
    }
}