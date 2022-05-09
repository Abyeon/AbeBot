const { MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');

let settings = { method: "GET" };

const platforms = ["pc", "steam", "epic-games-store", "ubisoft", "gog", "itchio", "ps4", "ps5", "xbox-one", "xbox-series-xs", "switch", "android", "ios", "vr", "battlenet", "origin", "drm-free", "xbox-360"];

module.exports = {
    name: 'freegames',
    description: 'Responds with a list of current free games for the chosen platform',
    aliases: ['free'],
    usage: '(platform)',
    cooldown: 2,
    
    execute (message, args) {
        let chosenPlatform = ((args.length > 0) ? args[0].toLowerCase() : "pc");

        let matchingPlatforms = []
        platforms.forEach(platform => {
            if (platform.indexOf(chosenPlatform) == 0) matchingPlatforms.push(platform);
        });

        // User input had too many possible platforms. STOP!
        if (matchingPlatforms.length > 1 || matchingPlatforms.length == 0) {
            message.reply("Possible platforms to search:\n\`pc, steam, epic-games-store, ubisoft, gog, itchio, ps4, ps5, xbox-one, xbox-series-xs, switch, android, ios, vr, battlenet, origin, drm-free, xbox-360\`");
            return;
        } else {
            chosenPlatform = matchingPlatforms[0];
        }

        let list = "";
        const embed = new MessageEmbed()
            .setColor(message.guild.me.displayHexColor)
            .setTimestamp()

        let url = `https://www.gamerpower.com/api/giveaways?type=game&platform=${chosenPlatform}&sort-by=value`;

        fetch(url, settings)
            .then(res => res.json())
            .then((json) => {
                for (var i = 0; i < 20 && i < json.length; i++) {
                    list += `\n${json[i].worth} [${json[i].title}](${json[i].open_giveaway})`;
                }

                if (json.length == undefined) {
                    embed.setTitle("ERROR!");
                    embed.setDescription(json.status_message);
                } else {
                    embed.setTitle(`Top ${(20 > json.length) ? json.length : 20} Current Free Games For ${chosenPlatform.toUpperCase()}`)
                    embed.setDescription(list);
                }
                
                message.channel.send({embeds: [embed] });
            });

    }
}