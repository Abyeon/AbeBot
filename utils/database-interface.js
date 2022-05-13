const db = require('quick.db');
const defaultSettings = require('../config.json');

class GuildData {
    constructor(id, users = [], settings = new SettingsData()) {
        this.id = id;
        this.users = users.map(user => {
            return new UserData(user.id, user.xp, user.level);
        });
        this.settings = settings;
    }

    hasUser(id) {
        let user = this.users.find(user => user.id == id);
        if (user) {
            return true;
        } else {
            return false;
        }
    }

    addUser(id) {
        if (this.hasUser(id)) return;
        let user = new UserData(id, 0, 1, this)
        this.users.push(user);
        return user;
    }

    getUserById(id) {
        return this.users.find(user => user.id == id);
    }

    // Save the current data to db (persistent storage)
    async save() {
        let data = { users: [], settings: {} };
        data.users = this.users;
        data.settings = this.settings;

        await db.set(`guild_${this.id}`, data);
    }
}

class SettingsData {
    constructor(prefix = defaultSettings.prefix, modules = []) {
        this.prefix = prefix;
        this.modules = modules;
    }

    hasModule(module) {
        return this.modules.includes(module);
    }

    addModule(module) {
        if (this.hasModule(module)) return;
        return this.modules.push(module);
    }

    delModule(module) {
        if (this.hasModule(module)) {
            let index = this.modules.indexOf(module);
            return this.modules.splice(index, 1);
        }
    }
}

class UserData {
    constructor(id, xp, level) {
        this.id = id;
        this.xp = xp;
        this.level = level;
    }

    setXp (amount) {
        this.xp = amount;
        return this.xp;
    }

    addXp (amount) {
        this.xp += amount;
        return this.xp;
    }
}

class Database {
    constructor() {
        this.guilds = [];
    }

    // Check if guild already exists
    hasGuild(id) {
        let guild = this.guilds.find(guild => guild.id == id);
        if (guild) {
            return true;
        } else {
            return false;
        }
    }

    // Add a new guild to the DB
    async addGuild(id) {
        // If guild is already in database, return it.
        if (this.hasGuild(id)) {
            return this.getGuildById(id);
        }

        // Find guild in QuickDB, then add it to database.
        let data;
        let guild;

        if (db.has(`guild_${id}`)) {
            data = await db.get(`guild_${id}`);
            guild = new GuildData(id, data.users, data.settings);
            this.guilds.push(guild);
            return guild;
        }
        
        // If guild doesnt exist, create it.
        guild = new GuildData(id);

        data = { users: [], settings: {} };
        data.users = guild.users;
        data.settings = guild.settings;

        db.set(`guild_${id}`, data);
        this.guilds.push(guild);

        return guild;
    }

    // Find a guild matching provided ID and return it
    getGuildById(id) {
        return this.guilds.find(guild => guild.id == id);
    }
}

module.exports = {
    Database,
    GuildData,
    UserData
}