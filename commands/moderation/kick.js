module.exports = {
    name: "kick",
    description: "Kicks a user from the server.",
    guildOnly: true,
    args: true,
    permissions: 'KICK_MEMBERS',
    usage: '[user] (reason..)',

    async execute (message, args) {
        let member = await message.guild.members.fetch(message.mentions.users.first().id);
        if (member) {
            try {
                let reason = args[1] ? args[1] : "No reason specified.";
                member.kick({reason: reason});
                message.reply(`Kicked ${member.displayName} for \`\`${reason}\`\``);
            } catch (e) {
                console.log(e);
                message.reply("I do not have permissions to kick that user.");
            }
        } else {
            message.reply("No members mentioned.");
        }
    }
}