const fetch = require('node-fetch');
const fs = require('fs');

// const url = "https://www.gamerpower.com/api/giveaways?type=game&platform=pc&sort-by=value";
// const settings = { method: "GET" };

// let lastGames = []

// function gpLoop() {

//     fetch(url, settings)
//         .then(res => res.json())
//         .then((json) => {
//             let temp = []
//             json.forEach(game => {
//                 temp.push({title: game.title, gameUrl: game.open_giveaway, worth: game.worth});
//             });

//             console.log(temp);

//             let symmDiff = temp.filter(x => !lastGames.includes(x)).concat(lastGames.filter(x => !temp.includes(x)));

//             if (symmDiff.length > 0) {
//                 let newGames = temp.filter(x => !lastGames.includes(x));
//                 let removedGames = lastGames.filter(x => !temp.includes(x));

//                 console.log(temp);

//                 lastGames = temp;
//             }
//         });
// }

const { prefix } = require('../config.json');

module.exports = {
    name: 'ready',
    once: true,
    execute(client) {
        console.log(`Logged in as ${client.user.tag}!`);
        client.user.setPresence({
            status: 'available',
            activity: {
                name: `${prefix}help`,
                type: "STREAMING",
                url: "https://github.com/Abyeon/AbeBot"
            }
        })//.then(presence => console.log(`Activity set to ${presence.activities[0].type}: ${presence.activities[0].name}`));
        // setInterval(gpLoop, 10000);

        if (!fs.existsSync('./settings.json')) {
            try {
                fs.writeFileSync('./settings.json', '{\"guilds\": []}');
            } catch (err) {
                console.error(err);
            }
        }
    }
}