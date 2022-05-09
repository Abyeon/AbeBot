const { MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');

module.exports = {
    name: "randomcat",
    aliases: ['cat'],
    description: "Sends a picture of a random cat",
    cooldown: 2,

    execute(message, args) {
        let url = "https://api.thecatapi.com/v1/images/search";
        let settings = { method: "GET" };

        const embed = new MessageEmbed()
            .setColor(message.guild.me.displayHexColor)
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