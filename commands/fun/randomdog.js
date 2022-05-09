const { MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');

module.exports = {
    name: "randomdog",
    aliases: ['dog'],
    description: "Sends a picture of a random dog",
    cooldown: 2,

    execute(message, args) {
        let url = "https://dog.ceo/api/breeds/image/random";
        let settings = { method: "GET" };

        const embed = new MessageEmbed()
            .setColor(message.guild.me.displayHexColor)
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