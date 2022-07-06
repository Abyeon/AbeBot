const { MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');

let settings = { method: "GET", mode: "cors"};

module.exports = {
    name: 'ffxiv',
    description: 'Accesses the XIV API',
    aliases: ['finalfantasy', 'xiv'],
    usage: '(character id)',
    cooldown: 5,
    
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
            // Request Character data
            let response = await xiv.character.get(args[0], {data: ['MIMO']});
            
            // If we recieve an error from the API
            if (response.Error) {
                message.reply(response.Message);
                console.log(response.Message);
                return;
            }

            let character = response.Character;

            // Check if character exists (I dont think we should ever get here)
            if (!character) {
                message.reply("Character does not exist, or something went horribly wrong!");
                return;
            }

            let classjob = await xiv.data.list("ClassJob", {ids: [character.ActiveClassJob.JobID]});
            let classicon = classjob.Results[0].Icon;

            embed.setTitle(character.Name);
            embed.setURL(`https://na.finalfantasyxiv.com/lodestone/character/${args[0]}/`);
            embed.setAuthor({name: `Level ${character.ActiveClassJob.Level} ${capitalizeWords(character.ActiveClassJob.Name)}`});
            embed.setThumbnail(`https://xivapi.com${classicon}`);
            embed.setImage(character.Portrait);
            embed.setDescription(`**Server:** ${character.DC} ${character.Server}`);

            // Show player's Free Company
            if (character.FreeCompanyName) {
                embed.addField("Free Company", character.FreeCompanyName);
            }

            // If player is a part of a grand company, show their rank.
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
                        grandCompany = "Order of the Twin Adder";

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

            /* LONG-WINDED WAY OF FINDING TOTAL ITEM LEVEL */

            let gearIDs = [];
            Object.values(character.GearSet.Gear).forEach(item => {
                gearIDs.push(item.ID);
            });

            let gearData = [];

            for await (const ID of gearIDs) {
                let item = await xiv.data.get("item", ID);
                gearData.push(item);
            }

            let totalItemLevel = 0;
            gearData.forEach(item => {
                totalItemLevel += item.LevelItem;
            });

            embed.addField("Item Level", totalItemLevel.toString(), true);

            // Show how many mounts player has
            if (response.Mounts) {
                embed.addField("Mounts", response.Mounts.length.toString(), true);
            }
            
            // Show how many minions player has
            if (response.Minions) {
                embed.addField("Minions", response.Minions.length.toString(), true);
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