module.exports = {
    name: "ping",
    description: "Pings!",
    cooldown: 5,

    execute(message, args) {
        message.channel.send("Pong!");
    }
}