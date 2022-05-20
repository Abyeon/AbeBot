module.exports = {
    name: "purge",
    description: "Purges specified amount of messages from channel.",
    guildOnly: true,
    args: true,
    permissions: 'MANAGE_MESSAGES',
    usage: '[amount]',

    execute (message, args) {
        let amount = args[0];
        if (!amount) {
            return message.reply("Please provide an amount of messages to purge.");
        }

        message.channel.messages.fetch({ limit: amount})
            .then(messages => {
                let queuedMessages = [];

                messages.forEach(msg => {
                    if (msg.deletable) {
                        queuedMessages.push(msg);
                    }
                });

                message.channel.bulkDelete(queuedMessages);
            })
    }
}