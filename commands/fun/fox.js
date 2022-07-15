const { MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');

module.exports = {
    name: "fox",
    description: "Sends a picture of a random fox",
    sendTyping: true,
    cooldown: 2,

    execute(message, args) {
        let url = "https://randomfox.ca/floof/";
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
            .setTitle("A random fox appears!")
            .setTimestamp();

        fetch(url, settings)
            .then(res => res.json())
            .then((json) => {
                embed.setImage(json.image);
                message.channel.send({embeds: [embed]});
            });
    }
}