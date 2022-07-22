const fetch = require("node-fetch");
const config = require('../config.json');
const db = require('quick.db');

class Twitch {
    constructor(id, secret) {
        this.id = id;
        this.secret = secret;
        this.token;
        this.expires = 0;
        this.tokenTimestamp;
    }

    /* Get a channel's ID by Username. */
    getChannelByName(username) {
        let url = `https://api.twitch.tv/helix/search/channels?query=${username}&first=1`;

        let settings = {
            method: "GET",
            headers: {
                'Authorization': `Bearer ${this.token}`,
                'Client-Id': this.id,
                'Ratelimit': 'Limit',
                'Ratelimit': 'Remaining'
            }
        }

        return new Promise((resolve, reject) => {
            fetch(url, settings)
                .then(async (res) => {
                    let json = await res.json();

                    // TODO: Avoid passing ratelimit. (800 requests per minute)
                    // This limit shouldnt be passed any time soon, though.

                    if (json.status == 401) {
                        // Unauthorized. Auth.
                        this.auth();
                        reject("Twitch token is invalid.");
                    }

                    if (json.data.length > 0) {
                        let user = json.data[0];
                        resolve(user);
                    } else {
                        reject("Couldnt find any matches for that twitch name.");
                    }
                }); 
        })
    }

    /* Get a channel's Vods */
    getChannelVods(id, limit = 0, sort = "time", type = "all") {
        let url = `https://api.twitch.tv/helix/videos?user_id=${id}&sort=${sort}&type=${type}`;
        if (limit > 0) url += `&first=${limit}`;

        console.log(url);

        let settings = {
            method: "GET",
            headers: {
                'Authorization': `Bearer ${this.token}`,
                'Client-Id': this.id
            }
        }

        return new Promise((resolve, reject) => {
            fetch(url, settings)
                .then(res => res.json())
                .then((json) => {
                    if (json.status == 401) {
                        // Unauthorized. Auth.
                        this.auth();
                        reject("Twitch token is invalid.");
                    }

                    if (json.data.length == 0) {
                        return reject("No vods found.");
                    }
        
                    json.data.forEach(vod => {
                        // Convert duration string to milliseconds
                        let duration = vod.duration;
                        let days = duration.substring(0, duration.indexOf('d'));
                        let hours = duration.substring(duration.indexOf('d') == -1 ? 0 : duration.indexOf('d') + 1, duration.indexOf('h'));
                        let minutes = duration.substring(duration.indexOf('h') == -1 ? 0 : duration.indexOf('h') + 1, duration.indexOf('m'));
                        let seconds = duration.substring(duration.indexOf('m') == -1 ? 0 : duration.indexOf('m') + 1, duration.indexOf('s'));

                        // Avert your eyes
                        let final = (days * 86400000) + (hours * 3600000) + (minutes * 60000) + (seconds * 1000);
                        vod.duration_ms = final; // Store for convenience sake
                    });

                    return resolve(json.data);
                });
        });
    }

    /* Get stream by channel ID */
    getStreamByID (id) {
        let url = `https://api.twitch.tv/helix/streams?user_id=${id}&first=1`;

        let settings = {
            method: "GET",
            headers: {
                'Authorization': `Bearer ${this.token}`,
                'Client-Id': this.id
            }
        }

        return new Promise((resolve, reject) => {
            fetch(url, settings)
                .then(res => res.json())
                .then((json) => {
                    if (json.status == 401) {
                        // Unauthorized. Auth.
                        this.auth();
                        reject("Twitch token is invalid.");
                    }

                    if (json.data.length == 0) {
                        return reject("No streams found.");
                    }

                    return resolve(json.data[0]);
                })
        });
    }

    /* Validate the access token */
    async validate () {
        if (db.has("twitchToken")) {
            this.token = db.get("twitchToken");
        }

        let url = 'https://id.twitch.tv/oauth2/validate';

        let settings = {
            method: "GET",
            headers: {'Authorization':`OAuth ${this.token}`}
        }

        fetch(url, settings)
            .then(res => res.json())
            .then((json) => {
                if (json.status == 401) {
                    console.log("Twitch token invalid. Re-authing");
                    this.auth();
                    return;
                }

                console.log(`Twitch token is still valid. ${(json.expires_in / 60).toFixed(2)} minutes remaining.`);
                
                this.expires = json.expires_in;
            })
    }

    /* Authenticate with Twitch API */
    async auth () {
        let url = 'https://id.twitch.tv/oauth2/token';

        let body = {
            client_id: this.id,
            client_secret: this.secret,
            grant_type: 'client_credentials'
        }

        let settings = {
            method: "POST",
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(body)
        };

        fetch(url, settings)
            .then(res => res.json())
            .then((json) => {
                this.token = json.access_token;
                db.set("twitchToken", json.access_token); // Save the token to the config file

                this.expires = json.expires_in;
                this.tokenTimestamp = Date.now();

                console.log("Authenticated with twitch.");

                // Re-auth after token expires
                setInterval(this.validate, 3600000)
            })
    }
}

module.exports = { Twitch };