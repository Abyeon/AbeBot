const Discord = require('discord.js');

module.exports = {
    name: 'presenceUpdate',
    execute(oldPresence, newPresence) {
        if (oldPresence == null || newPresence == null) return;
        if (oldPresence.status == newPresence.status) return;

        const activitiesJoined = newPresence.activities.map((activity) => {
            return activity.name + activity.details;
        }).join(", ");

        console.log(`${newPresence.member.displayName} - ${oldPresence.status} -> ${newPresence.status} ${activitiesJoined}`);
    }
}