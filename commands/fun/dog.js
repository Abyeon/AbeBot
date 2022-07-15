const { MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');

module.exports = {
    name: "dog",
    description: "Sends a picture of a random dog",
    sendTyping: true,
    cooldown: 2,

    execute(message, args) {
        let url = "https://dog.ceo/api/breeds/image/random";
        let settings = { method: "GET" };

        // Set hex color for embed
        let hexColor = "#FFFFFF";
        if (message.guild) {
            if (message.guild.me.displayHexColor != "#000000") {
                hexColor = message.guild.me.displayHexColor;
            }
        }

        const embed = new MessageEmbed()
            .setColor(hexColor)
            .setTitle("A random dog appears!")
            .setTimestamp();

        fetch(url, settings)
            .then(res => res.json())
            .then((json) => {
                embed.setImage(json.message);
                message.channel.send({embeds: [embed]});
            });
    }
}