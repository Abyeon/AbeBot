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
        
        /* Fetch twitch user data */
        let user;
        try {
            user = await client.twitch.getChannelByName(username);
        } catch(e) {
            message.reply("Something went wrong")
            return;
        }

        // Fetch emote data
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

        /* --- Build the embed --- */
        const embed = new MessageEmbed()
            .setColor(hexColor)
            .setTitle(user.display_name)
            .setURL(`https://twitch.tv/${user.broadcaster_login}`)
            .setThumbnail(user.thumbnail_url)

    
        // Stream info
        if (user.title != "") embed.addField("Stream Title", `\`\`\`${user.title}\`\`\``);
        if (user.game_name != "") embed.addField("Playing", user.game_name, user.is_live);

        // Get the time the stream started as a unix timestamp
        let liveSince = Math.floor(new Date(user.started_at).getTime() / 1000);

        if (user.is_live) {
            try {
                let stream = await client.twitch.getStreamByID(user.id);
                if (stream.viewer_count > 0) {
                    embed.addField("Viewers", stream.viewer_count.toString(), true);
                }

                if (stream.thumbnail_url) {
                    let imageURL = stream.thumbnail_url;
                    imageURL = imageURL.replace("{width}", "1920");
                    imageURL = imageURL.replace("{height}", "1080");

                    embed.setImage(imageURL);
                }
            } catch (e) {
                console.log(e);
            }

            embed.addField("Went live", `<t:${liveSince}:R>`);

        } else {
            embed.setDescription("Not Live");

            try {
                let lastVod = await client.twitch.getChannelVods(user.id, 1, "time", "archive").then(data => data[0]);

                let lastLive = Math.floor((new Date(lastVod.created_at).getTime() + lastVod.duration_ms) / 1000);

                embed.addField("Latest Vod", `[<t:${lastLive}:R>](${lastVod.url})`);
            } catch (e) {
                console.log(e);
            }
        }

        // Emotes
        if (bttv.sharedEmotes)
            embed.addField("BTTV", `[Click Here](https://betterttv.com/users/${bttv.id})`, true);
        
        if (ffz.length > 0)
            embed.addField("FFZ", `[Click Here](https://www.frankerfacez.com/channel/${user.broadcaster_login})`, true);

        // Send the embed
        message.reply({embeds: [embed], allowedMentions: { parse: [] }});
    }
}