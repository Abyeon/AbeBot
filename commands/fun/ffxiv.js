const { MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');

let settings = { method: "GET", mode: "cors"};

module.exports = {
    name: 'ffxiv',
    description: 'Accesses the XIV API',
    aliases: ['finalfantasy', 'xiv'],
    usage: '(character id)',
    cooldown: 2,
    
    async execute (message, args, client) {
        // Get access to the xiv client
        const xiv = client.xiv;

        // Set hex color for embed
        let hexColor = "#FFFFFF";
        if (message.guild) {
            if (message.guild.me.displayHexColor != "#000000") {
                hexColor = message.guild.me.displayHexColor;
            }
        }

        // Generate embed
        const embed = new MessageEmbed()
            .setColor(hexColor)

        try {
            let response = await xiv.character.get(args[0]);
            let character = response.Character;
            let classjob = await xiv.data.list("ClassJob", {ids: [character.ActiveClassJob.JobID]});
            let classicon = classjob.Results[0].Icon;

            embed.setTitle(character.Name);
            embed.setURL(`https://na.finalfantasyxiv.com/lodestone/character/${args[0]}/`);
            embed.setAuthor({name: `Level ${character.ActiveClassJob.Level} ${capitalizeWords(character.ActiveClassJob.Name)}`});
            embed.setThumbnail(`https://xivapi.com${classicon}`);
            embed.setImage(character.Portrait);
            embed.setDescription(`**Server:** ${character.DC} ${character.Server}`);

            if (character.FreeCompanyName) {
                embed.addField("Free Company", character.FreeCompanyName);
            }

            // If character is a part of a grand company, show their rank.
            if (character.GrandCompany) {
                let grandCompany = "";
                let grandCompanyRank;

                // Find correct string for Grand Company rank. (Way too spaghetti)
                switch (character.GrandCompany.NameID) {
                    case (1):
                        grandCompany = "Maelstrom";
                        if (character.Gender = 1) {
                            grandCompanyRank = await xiv.data.get("GCRankLimsaMaleText", character.GrandCompany.RankID);
                        } else {
                            grandCompanyRank = await xiv.data.get("GCRankLimsaFemaleText", character.GrandCompany.RankID);
                        }
                        break;
                    case (2):
                        grandcompany = "Order of the Twin Adder";
                        if (character.Gender = 1) {
                            grandCompanyRank = await xiv.data.get("GCRankGridaniaMaleText", character.GrandCompany.RankID);
                        } else {
                            grandCompanyRank = await xiv.data.get("GCRankGridaniaFemaleText", character.GrandCompany.RankID);
                        }
                        break;
                    case (3):
                        grandCompany = "Immortal Flames";
                        if (character.Gender = 1) {
                            grandCompanyRank = await xiv.data.get("GCRankUldahMaleText", character.GrandCompany.RankID);
                        } else {
                            grandCompanyRank = await xiv.data.get("GCRankUldahFemaleText", character.GrandCompany.RankID);
                        }
                        break;
                    default:
                        break;
                }

                embed.addField(grandCompany, grandCompanyRank.Name);
            }

            message.channel.send({embeds: [embed] });
        } catch (e) {
            console.log(e);
            message.reply("Error!");
        }
    }
}

function capitalizeWords(string) {
    const words = string.split(" ");

    return words.map((word) => {
        return word[0].toUpperCase() + word.substring(1);
    }).join(" ");
}