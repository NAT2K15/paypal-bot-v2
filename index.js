const { Client, Collection, MessageEmbed } = require('discord.js');
const client = new Client();
const fs = require('fs');
const config = require("./config.json");
const chalk = require('chalk')
const { error, warning } = require('log-symbols');
const glob = require('glob')
const paypal = require('paypal-rest-sdk');


paypal.configure({
    'mode': config.paypal_info.option,
    'client_id': config.paypal_info.client,
    'client_secret': config.paypal_info.secret
});

client.config = config;
client.paypal = paypal

const mysql = require('mysql');
connection = mysql.createPool({
    connectionLimit: 10,
    host: config["database"].host,
    user: config["database"].user,
    password: config["database"].password,
    database: config["database"].name,
});
console.log(chalk.green `I have connected to the database!`)

//command handler
const { sep } = require("path");
["commands", "aliases"].forEach(x => client[x] = new Collection());

//command handler
client.prefix = config.prefix;
const cmds = glob.sync("./commands/**/*.js")
const load = () => {
    for (const file of cmds) {
        const pull = require(file)
        if (pull.help && typeof(pull.help.name) === "string" && typeof(pull.help.category) === "string") {
            if (client.commands.get(pull.help.name)) return console.warn(`${warning} Two or more commands have the same name ${pull.help.name}.`);
            client.commands.set(pull.help.name, pull);
        } else {
            console.log(`${error} Error loading command in ${file} you have a missing help.name or help.name is not a string. or you have a missing help.category or help.category is not a string`);
            continue;
        }
        if (pull.help.aliases && typeof(pull.help.aliases) === "object") {
            pull.help.aliases.forEach(alias => {
                if (client.aliases.get(alias)) return console.warn(`${warning} Two commands or more commands have the same aliases ${alias}`);
                client.aliases.set(alias, pull.help.name);
            });
        }
    }
}
load();
const eventList = glob.sync("./events/**/*.js")
for (const file of eventList) {
    try {
        const event = require(file);
        let eventName = file.split("/").pop().split(".").shift()
        client.on(eventName, event.bind(null, client));
        delete require.cache[require.resolve(file)];
    } catch (err) {
        console.log(`${error} Error loading event in ${file} you have an error for some reason`);
        console.error(err)
        continue;
    }
}
setInterval(() => {
    connection.query(`SELECT * FROM paypalbot WHERE hasitbeensent = '0'`, async function(err, reslove) {
        if (reslove === undefined) return console.log(chalk.red `[ERROR] ` + chalk.white `There was an error connecting to the SQL please ensure all your credentials are vaild`);
        reslove.forEach(eachpayment => {
            client.paypal.invoice.get(eachpayment.payer_id, async function(err2, invoice) {
                if (err2) {
                    console.log(chalk.red `[PAYPAL ERROR] ` + chalk.white `I had an error checking the invoice ID for ${invoice}. If this issue is on going make sure to contact NAT2K15 for support @ https://discord.gg/RquDVTfDwu`)
                } else {
                    if (invoice.status == 'PAID') {
                        connection.query(`UPDATE paypalbot SET orderstatus = 'PAID', hasitbeensent = '1' WHERE payer_id = '${eachpayment.payer_id}'`);
                        connection.query(`SELECT * FROM paypalbot WHERE orderstatus = 'PAID' AND hasitbeensent = '1' AND payer_id = '${eachpayment.payer_id}'`, async function(errr, lastreslove) {
                            let channel = client.channels.cache.get(eachpayment.channel);
                            if (!channel) return console.log(chalk.red `[ERROR] ` + chalk.white `I was not able to find the channel "${invoice.channel}" it might of already been deleted!. If this issue is still on going make sure to contact NAT2K15 for support @ https://discord.gg/RquDVTfDwu`)
                             let productid = eachpayment.productid;
                            connection.query(`SELECT * FROM products WHERE id = '${productid}'`, async function(er, forgetabouthtisone) {                   
                                let e1 = new MessageEmbed()
                                    .setTitle(`Invoice Paid | ${eachpayment.discordTag}`)
                                    .setColor('GREEN')
                                    .setFooter(config.embed.footer)
                                    .addField(`Amount Paid`, eachpayment.amount, true)
                                    .addField(`Invoice ID`, `\`${eachpayment.payer_id}\``, true)
                                    .addField(`Email`, `\`${eachpayment.email}\``)
                                    .addField(`Product description`, eachpayment.descriptions)
                                    .addField(`Download link`, `||${forgetabouthtisone[0].download_link}||`)
                                    .setTimestamp()
                                channel.send(e1).catch(e => {
                                    if (e) console.log(chalk.red `[ERROR] ` + chalk.white `I had an issue sending a message to "${channel.id}"`)
                                })
                                connection.query(`UPDATE paypalbot SET orderstatus = 'PAID', hasitbeensent = '1' WHERE payer_id = '${eachpayment.payer_id}'`);
                            })

                        })

                    }
                }
            })
        })
    })
}, 5000); //5 seconds


client.login(config.token)
