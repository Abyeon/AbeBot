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

    /* Get a Twitch channels ID by Username. */
    getTwitchChannelID(username) {
        let url = `https://api.twitch.tv/helix/search/channels?query=${username}&first=1`;

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

                if (json.data.length > 0) {
                    let user = json.data[0];
                    resolve(user);
                } else {
                    reject("Couldnt find any matches for that twitch name.");
                }
            }); 
        })
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

                console.log("Logged into twitch.");

                // Re-auth after token expires
                setInterval(this.validate, 3600000)
            })
    }
}

module.exports = { Twitch };