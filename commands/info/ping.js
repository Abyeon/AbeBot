module.exports = {
    name: "ping",
    description: "Pings!",
    usage: "",
    cooldown: 5,
    aliases: [],

    execute(message, args) {
        message.channel.send("Pong!");
    }
}