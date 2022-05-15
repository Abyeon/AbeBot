module.exports = {
    name: "module",
    description: "Enables or disables a module for the server.",
    guildOnly: true,
    args: true,
    permissions: 'MANAGE_GUILD',
    usage: "(enable | disable | list) (module)",

    async execute(message, args, client) {
        // Pull the guild's data from the DB
        let guildData = await client.db.addGuild(message.guildId);
        let modules = guildData.settings.modules;
        let operation = args[0].toLowerCase();

        // Check if first argument is valid
        if (operation != "enable" && operation != "disable" && operation != "list") {
            message.reply("Incorrect syntax! Please specify whether to `enable`, `disable` or `list`!");
            return;
        }

        // Check if user provided a module
        if (args.length < 2) {
            // List disabled modules
            if (operation == "list") {
                message.reply(`**Disabled modules:** \n${modules.join(', ')}`);
                return;
            }

            message.reply("Must specify a module!");
            return;
        }

        let module = args[1].toLowerCase();

        // Check that the provided module is NOT this one!
        if (module == "utility") {
            message.reply("Cannot disable the utility module! Otherwise this would be irreversable.");
            return;
        }

        // Remove a module from the blacklist
        if (operation == "enable") {
            // Check if module is in the blacklist
            if (modules.includes(module)) {
                // Remove it from the blacklist
                let index = modules.indexOf(module);
                modules.splice(index, 1);
                await guildData.save();
                console.log(guildData.settings.modules);

                message.reply("Successfully enabled module!");
                return;
            }

            // Module is not in the blacklist
            message.reply("Module is already enabled!");
            return;
        }

        // Add a module to the blacklist
        if (operation == "disable") {
            // Check if module is already in blacklist
            if (modules.includes(module)) {
                message.reply("Module is already disabled!");
                return;
            }

            // Add module to the blacklist
            modules.push(module);
            await guildData.save();
            console.log(guildData.settings.modules);

            message.reply("Successfully disabled module!");
            return;
        }
    }
}