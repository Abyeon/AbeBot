const db = require('quick.db');

class GuildData {
    constructor(id, users = [], settings = {}) {
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
        db.set(`guild_${id}`, { users: [], settings: {} });
        guild = new GuildData(id);
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