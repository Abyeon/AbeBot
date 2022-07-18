const fetch = require("node-fetch");

class Twitch {
    constructor(id, secret) {
        this.id = id;
        this.secret = secret;
        this.token = "";
        this.expires = 0;
    }

    

    async login () {
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
                this.expires = json.expires_in;

                // Re-auth after token expires
                setTimeout(this.login.bind(this), json.expires_in);
            })
    }
}

module.exports = { Twitch };