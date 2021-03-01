const config = require('../config.json')
module.exports = async(client) => {
    console.log(`Logged in as ${client.user.tag}!`);
    console.log(`\x1b[91m[Made by NAT2K15] \x1b\x1b[0m`);
    setInterval(() => client.user.setActivity(` ${config.status}`, { type: "WATCHING" }), 5000)
}