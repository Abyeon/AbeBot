module.exports = {
    name: "ping",
    description: "Pings!",
    args: false,
    usage: "",
    guildOnly: false,
    cooldown: 5,
    aliases: [],
    
    execute(message, args) {
        message.channel.send("Pong!");
    }
}