const { MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');

module.exports = {
    name: "twitch",
    aliases: ['ttv'],
    description: "Displays stream info for a user",
    guildOnly: true,
    args: true,
    permissions: 'MANAGE_GUILD',
    usage: "(link)",

    async execute(message, args, client) {
        let username = args[0].toLowerCase();
        let user;
        
        try {
            user = await client.twitch.getTwitchChannelByName(username);
        } catch(e) {
            message.reply("Something went wrong")
            return;
        }

        let bttvURL = `https://api.betterttv.net/3/cached/users/twitch/${user.id}`;
        let ffzURL = `https://api.betterttv.net/3/cached/frankerfacez/users/twitch/${user.id}`;

        let settings = { method: "GET" };

        let bttv = await fetch(bttvURL, settings).then(res => res.json());
        let ffz = await fetch(ffzURL, settings).then(res => res.json());

        // Set hex color for embed
        let hexColor = "#FFFFFF";
        if (message.guild) {
            if (message.guild.me.displayHexColor != "#000000") {
                hexColor = message.guild.me.displayHexColor;
            }
        }

        // Build the embed
        const embed = new MessageEmbed()
            .setColor(hexColor)
            .setAuthor({name: (user.is_live ? 'Currently Live' : 'Not Live')})
            .setTitle(user.display_name)
            .setURL(`https://twitch.tv/${user.broadcaster_login}`)
            .setThumbnail(user.thumbnail_url)

    
        // Stream info
        if (user.title != "") embed.addField("Stream Title", user.title);
        if (user.game_name != "") embed.addField("Playing", user.game_name);

        // Get the time the stream started as a unix timestamp
        let liveSince = Math.floor(new Date(user.started_at).getTime() / 1000);

        if (user.is_live) embed.addField("Went live", `<t:${liveSince}:R>`)

        console.log()

        // Emotes
        if (bttv.sharedEmotes)
            embed.addField("BTTV", `[Click Here](https://betterttv.com/users/${bttv.id})`, true);
        
        if (ffz.length > 0)
            embed.addField("FFZ", `[Click Here](https://www.frankerfacez.com/channel/${user.broadcaster_login})`, true);

        // Send the embed
        message.reply({embeds: [embed], allowedMentions: { parse: [] }});
    }
}