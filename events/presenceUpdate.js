const Discord = require('discord.js');

module.exports = {
    name: 'presenceUpdate',
    execute(oldPresence, newPresence) {
        console.log(`${newPresence.member.displayName} - ${newPresence.status}`);
    }
}