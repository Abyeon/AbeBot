const Discord = require('discord.js');

module.exports = {
    name: 'presenceUpdate',
    execute(oldPresence, newPresence) {
        if (!oldPresence || !newPresence.activities || !oldPresence.activities) return;

        /* DETECT IF A USER BEGINS STREAMING */

        // If user was already streaming, return.
        if (oldPresence.activities.some(activity => activity.type == "STREAMING")) return;

        // Find stream in users activities, and if stream exists, log it!
        let stream = newPresence.activities.find(activity => activity.type == "STREAMING");
        
        if (stream) {
            // New stream, log it!
            console.log(`${newPresence.user.tag} is streaming at ${stream.url}`)
        }
    }
}