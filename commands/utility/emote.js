const fetch = require('node-fetch');

module.exports = {
    name: "emote",
    aliases: ['ttv'],
    description: "Steals bttv emotes from twitch channel",
    guildOnly: true,
    args: true,
    permissions: 'MANAGE_GUILD',
    usage: "(link)",

    async execute(message, args, client) {
        let username = args[0].toLowerCase();
        let user;
        
        try {
            user = await client.twitch.getTwitchChannelID(username);
        } catch(e) {
            message.reply(e)
            return;
        }

        // Couldnt find any matches
        if (user === null) {
            
        }

        let url = `https://api.betterttv.net/3/cached/users/twitch/${user.id}`;

        let settings = { method: "GET" };
        
        fetch(url, settings)
            .then(res => res.json())
            .then((json) => {
                if (!json.id) {
                    message.reply("No BTTV emotes found for user.");
                    return;
                }
                message.reply(`https://betterttv.com/users/${json.id}`)
            })
        
    }
}