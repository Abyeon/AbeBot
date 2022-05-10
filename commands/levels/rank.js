module.exports = {
    name: "rank",
    description: "Tells the user their level in the server.",
    cooldown: 5,

    execute(message, args, client) {
        let guildInfo = client.db.get(`guild_${message.guildId}`);
        let userInfo = guildInfo.users.find(user => user.id == message.author.id);
        
        message.reply(`Your level is **${userInfo.level}**, and your xp is at **${userInfo.xp}**.`);
    }
}