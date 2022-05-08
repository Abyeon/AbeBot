module.exports = {
    name: "ping",
    description: "Pings!",
    cooldown: 5,

    execute(message, args) {
        message.channel.send("Pong!")
            .then((msg) => {
                setTimeout(function() {
                    let ms = msg.createdTimestamp - message.createdTimestamp;
                    msg.edit("Pong! `" + ms + "ms`");
                }, 100);
            });
    }
}