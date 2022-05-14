const { MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');

module.exports = {
    name: "fox",
    description: "Sends a picture of a random fox",
    cooldown: 2,

    execute(message, args) {
        let url = "https://randomfox.ca/floof/";
        let settings = { method: "GET" };

        const embed = new MessageEmbed()
            .setColor(message.guild.me.displayHexColor)
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