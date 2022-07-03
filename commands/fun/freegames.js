const { MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');

let settings = { method: "GET" };

const platforms = ["pc", "steam", "epic-games-store", "ubisoft", "gog", "itchio", "ps4", "ps5", "xbox-one", "xbox-series-xs", "switch", "android", "ios", "vr", "battlenet", "origin", "drm-free", "xbox-360"];

module.exports = {
    name: 'freegames',
    description: 'Responds with a list of current free games for the chosen platform',
    acceptedArguments: 'pc, steam, epic-games-store, ubisoft, gog, itchio, ps4, ps5, xbox-one, xbox-series-xs, switch, android, ios, vr, battlenet, origin, drm-free, xbox-360',
    aliases: ['free', 'games'],
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

        let url = `https://www.gamerpower.com/api/filter?platform=${chosenPlatform}&type=game&sort-by=popularity`;

        fetch(url, settings)
            .then(res => res.json())
            .then((json) => {
                let value = 0;

                for (var i = 0; i < 20 && i < json.length; i++) {
                    // Convert json string to float value
                    parsedWorth = parseFloat(json[i].worth.substring(1))

                    // Check to see if float value is usable
                    if (!isNaN(parsedWorth)) {
                        // If so, add it the total value
                        value += parsedWorth;
                    }

                    // Add game to embed
                    list += `\n${json[i].worth} [${json[i].title}](${json[i].open_giveaway})`;
                }

                if (json.length == undefined) {
                    embed.setTitle("ERROR!");
                    embed.setDescription(json.status_message);
                } else {
                    embed.setTitle(`Top ${(20 > json.length) ? json.length : 20} Free Games For ${matchingPlatforms.join(' ').toUpperCase()} Worth $${value.toFixed(2)}!`)
                    embed.setDescription(list);
                }
                
                message.channel.send({embeds: [embed] });
            });

    }
}