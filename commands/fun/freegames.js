const { MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');

let url = "https://www.gamerpower.com/api/giveaways?type=game&platform=pc&sort-by=value";
let settings = { method: "GET" };

module.exports = {
    name: 'freegames',
    description: 'Responds with a list of current free games',
    aliases: ['free'],
    cooldown: 5,
    
    execute (message, args) {
        let list = "";
        const embed = new MessageEmbed()
            .setColor(message.guild.me.displayHexColor)
            .setTitle('Top 10 Current Free Games')
            .setTimestamp()

        fetch(url, settings)
            .then(res => res.json())
            .then((json) => {
                for (var i = 0; i < 10 && i < json.length; i++) {
                    //embed.addField('\u200B', `[${json[i].title}](${json[i].open_giveaway})`)
                    list += `\n${json[i].worth} [${json[i].title}](${json[i].open_giveaway})`;
                }
                embed.setDescription(list);
                message.channel.send(embed);
            });

    }
}