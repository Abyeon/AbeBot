const fs = require('fs');

module.exports = {
    name: 'reload',
    description: 'Reloads a command',
    args: true,
    guildOnly: true,
    debug: true,

    execute (message, args) {
        const commandName = args[0].toLowerCase();
        const command = message.client.commands.get(commandName) || message.client.commands.find(cmd => cmd.aliases.includes(commandName));

        if (!command) {
            return message.channel.send(`There is no command with the name \`${commandName}\``);
        }

        const commandFolders = fs.readdirSync('./commands');
        const folderName = commandFolders.find(folder => fs.readdirSync(`./commands/${folder}`).includes(`${command.name}.js`));

        delete require.cache[require.resolve(`../${folderName}/${command.name}.js`)];

        try {
            const newCommand = require(`../${folderName}/${command.name}.js`);
            newCommand.module = folderName;
            message.client.commands.set(newCommand.name, newCommand);
            message.channel.send(`Command \`${newCommand.name}\` was reloaded!`);
        } catch (err) {
            console.error(err);
            message.channel.send(`There was an error while reloading the command \`${command.name}\`:\n\`${err.message}\``);
        }
    }
}