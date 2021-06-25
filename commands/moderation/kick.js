module.exports = {
    name: "kick",
    description: "Kicks a user from the server.",
    guildOnly: true,
    args: true,
    permissions: 'KICK_MEMBERS',
    usage: '[user] (reason..)',

    execute (message, args) {
        let user = message.guild.member(message.mentions.users.first()) || message.guild.members.get(args[0]);
        if (!user) return message.channel.send('Not a valid user!');

        if (user.hasPermission('KICK_MEMBERS')) return message.channel.send('Invalid permissions.');

        let kickReason = args.slice(1).join(" ");
        if (!kickReason) kickReason = "None";

        user.kick({reason: kickReason})
    }
}