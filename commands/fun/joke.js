const { MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');

const categories = ['any', 'misc', 'programming', 'dark', 'pun', 'spooky', 'christmas']

module.exports = {
    name: "joke",
    description: "Tells you a joke!\nPossible categories: \`Any, Misc, Programming, Dark, Pun, Spooky, Christmas\`",
    usage: "(category)",
    cooldown: 2,

    execute(message, args) {
        let category = (args.length > 0) ? args[0] : "Any";

        // Find matching category
        let matchingCategories = [];
        categories.forEach(cat => {
            if(cat.indexOf(category.toLowerCase()) == 0) matchingCategories.push(cat);
        });

        if (matchingCategories.length > 1 || matchingCategories.length == 0) {
            message.reply("Possible categories: \`Any, Misc, Programming, Dark, Pun, Spooky, Christmas\`");
            return;
        }

        let url = `https://v2.jokeapi.dev/joke/${matchingCategories[0]}?blacklistFlags=nsfw+racist+sexist+political`;
        let settings = { method: "GET" };

        const embed = new MessageEmbed()
            .setColor(message.guild.me.displayHexColor)
            .setTimestamp();

        fetch(url, settings)
            .then(res => res.json())
            .then((json) => {
                if (json.type == "single") {
                    embed.setDescription(`**${json.joke}**`);
                } else {
                    embed.setDescription(`**${json.setup}\n\n${json.delivery}**`);
                }

                embed.setFooter({ text: `Category: ${json.category}`});

                message.channel.send({embeds: [embed]});
            });
    }
}