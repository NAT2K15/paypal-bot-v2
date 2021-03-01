const config = require('../../config.json');
const { MessageEmbed, Presence } = require('discord.js');

module.exports.run = async(client, message, args) => {
    message.delete()
    if (!message.member.roles.cache.some(r => config.perms_info.support_roles.includes(r.id))) {
        let e1 = new MessageEmbed()
            .setDescription(`You cannot use this command`)
            .setColor(config.embed.color)
            .setFooter(config.embed.footer)
        message.channel.send(e1).then(msg => msg.delete({ timeout: 10000 }));
    } else {
        let invoiceID = args[0];
        if (!invoiceID) {
            let e2 = new MessageEmbed()
                .setDescription(`Please make sure to input an invoice ID. Use ${config.prefix}${module.exports.help.name} (Invoice-ID)`)
                .setColor(config.embed.color)
                .setFooter(config.embed.footer)
            message.channel.send(e2).then(msg => msg.delete({ timeout: 25000 }));
        } else {
            client.paypal.invoice.get(invoiceID, async function(err, reslove) {
                if (err) {
                    let e3 = new MessageEmbed()
                        .setTitle(`PayPal Error`)
                        .setDescription(`I was not able to find an ID in paypals database. Please make sure you have an vaild invoice id`)
                        .setColor("RED")
                        .setFooter(`Made by NAT2K15`)
                    message.channel.send(e3)
                } else {
                    let e4 = new MessageEmbed();
                    e4.setTitle(`Invoice Status | ${message.guild.name}`)
                    if (reslove.status !== 'PAID') e4.addField(`Status`, 'Not Paid', true)
                    if (reslove.status == 'PAID') e4.addField(`Status`, `Paid`, true)
                    e4.addField(`PayPal ID`, `${invoiceID}`, true)
                    e4.setColor(config.embed.color)
                    e4.setFooter(config.embed.footer)
                    e4.setTimestamp()
                    message.channel.send(e4)
                }
            })
        }
    }
}

module.exports.help = {
    name: "checkinvoice",
    category: "pa",
    aliases: [],
    description: "This will check an invoice status for"
}