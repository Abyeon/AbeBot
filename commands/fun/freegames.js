const { MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');

let settings = { method: "GET" };

const platforms = ["pc", "steam", "epic-games-store", "ubisoft", "gog", "itchio", "ps4", "ps5", "xbox-one", "xbox-series-xs", "switch", "android", "ios", "vr", "battlenet", "origin", "drm-free", "xbox-360"];

module.exports = {
    name: 'freegames',
    description: 'Responds with a list of current free games for the chosen platform',
    acceptedArguments: 'pc, steam, epic-games-store, ubisoft, gog, itchio, ps4, ps5, xbox-one, xbox-series-xs, switch, android, ios, vr, battlenet, origin, drm-free, xbox-360',
    aliases: ['free'],
    usage: '(platform)',
    cooldown: 2,
    
    execute (message, args) {
        let chosenPlatform = ((args.length > 0) ? args[0].toLowerCase() : "pc");

        // Find possible wanted platforms from user input
        let matchingPlatforms = [];
        platforms.forEach(platform => {
            if (platform.indexOf(chosenPlatform) == 0) matchingPlatforms.push(platform);
        });

        // If no matching platforms, return.
        if (matchingPlatforms.length == 0) {
            message.reply("Possible platforms to search:\n\`pc, steam, epic-games-store, ubisoft, gog, itchio, ps4, ps5, xbox-one, xbox-series-xs, switch, android, ios, vr, battlenet, origin, drm-free, xbox-360\`");
            return;
        }

        // Join all matching platforms and prepare for GET request
        chosenPlatform = matchingPlatforms.join('.');

        // Set hex color for embed
        let hexColor = "#FFFFFF";
        if (message.guild) {
            if (message.guild.me.displayHexColor != "#000000") {
                hexColor = message.guild.me.displayHexColor;
            }
        }

        let list = "";
        const embed = new MessageEmbed()
            .setColor(hexColor)
            .setTimestamp()

        let url = `https://www.gamerpower.com/api/filter?platform=${chosenPlatform}&type=game&sort-by=value`;

        fetch(url, settings)
            .then(res => res.json())
            .then((json) => {
                for (var i = 0; i < 20 && i < json.length; i++) {
                    // Check if returned json includes a platform from our chosen platforms.
                    let gpPlatforms = json[i].platforms.split(', ');
                    let addToList = gpPlatforms.map(gpPlatform => {
                        if (matchingPlatforms.includes(gpPlatform)) {
                            return true;
                        }
                    })

                    // Add it to the returned embed.
                    if (addToList) {
                        list += `\n${json[i].worth} [${json[i].title}](${json[i].open_giveaway})`;
                    }
                }

                if (json.length == undefined) {
                    embed.setTitle("ERROR!");
                    embed.setDescription(json.status_message);
                } else {
                    embed.setTitle(`Top ${(20 > json.length) ? json.length : 20} Current Free Games For ${matchingPlatforms.join(' ').toUpperCase()}`)
                    embed.setDescription(list);
                }
                
                message.channel.send({embeds: [embed] });
            });

    }
}