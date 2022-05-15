const { MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');

module.exports = {
    name: "cat",
    description: "Sends a picture of a random cat",
    cooldown: 2,

    execute(message, args) {
        let url = "https://api.thecatapi.com/v1/images/search";
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
            .setTitle("A random cat appears!")
            .setTimestamp();

        fetch(url, settings)
            .then(res => res.json())
            .then((json) => {
                embed.setImage(json[0].url);
                message.channel.send({embeds: [embed]});
            });
    }
}