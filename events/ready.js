const fetch = require('node-fetch');

const url = "https://www.gamerpower.com/api/giveaways?type=game&platform=pc&sort-by=value";
const settings = { method: "GET" };

let lastGames = []

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

module.exports = {
    name: 'ready',
    once: true,
    execute(client) {
        console.log(`Logged in as ${client.user.tag}!`);
        // setInterval(gpLoop, 10000);
    }
}