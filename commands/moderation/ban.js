module.exports = {
    name: "ban",
    description: "Bans a user from the server.",
    guildOnly: true,
    args: true,
    permissions: 'BAN_MEMBERS',
    usage: '[user] (reason..)',

    execute (message, args) {
        let user = message.guild.member(message.mentions.users.first()) || message.guild.members.get(args[0]);
        if (!user) return message.channel.send('Not a valid user!');

        if (user.hasPermission('BAN_MEMBERS')) return message.channel.send('Invalid permissions.');

        let banReason = args.slice(1).join(" ");
        if (!banReason) banReason = "None";

        user.ban({reason: banReason})
    }
}