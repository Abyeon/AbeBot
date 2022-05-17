const { MessageEmbed } = require('discord.js');

module.exports = {
    name: "mute",
    description: "Timeout a user for specified duration",
    guildOnly: true,
    args: true,
    permissions: 'MUTE_MEMBERS',
    usage: '[user] (duration in minutes) (reason..)',

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

        // Get the duration to mute the user. Set to one hour if not specified.
        let duration = args[1];
        if (!duration) {
            duration = 60;
        }

        // Get the reason for the mute
        let reason = args.slice(2).join(" ");
        if (!reason) reason = "No reason provided";

        let botReason = `Issued by ${message.author.tag} with reason: ${reason}`;

        member.timeout(duration * 60 * 1000, botReason);

        // Build the embed
        const embed = new MessageEmbed({author: {name: `${member.user.tag} has been muted`, iconURL: member.user.displayAvatarURL({dynamic: true})}});
        
        message.reply({embeds: [embed]});
    }
}