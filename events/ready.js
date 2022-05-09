const fetch = require('node-fetch');
const fs = require('fs');

const { prefix } = require('../config.json');

module.exports = {
    name: 'ready',
    once: true,
    execute(client) {
        console.log(`Logged in as ${client.user.tag}!`);
        client.user.setPresence({
            status: 'available',
            activities: [{
                name: `${prefix}help`,
                type: "PLAYING"
            }]
        });

        if (!fs.existsSync('./settings.json')) {
            try {
                fs.writeFileSync('./settings.json', '{\"guilds\": []}');
            } catch (err) {
                console.error(err);
            }
        }
    }
}