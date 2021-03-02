const { MessageEmbed } = require('discord.js');
const config = require('../../config.json');
module.exports.run = async(client, message, args) => {
    await message.delete()
    if (!message.member.roles.cache.some(r => config.perms_info.support_roles.includes(r.id))) {
        let e1 = new MessageEmbed()
            .setDescription(`You cannot use this command`)
            .setColor(config.embed.color)
            .setFooter(config.embed.footer)
        message.channel.send(e1).then(msg => msg.delete({ timeout: 10000 }));
    } else {
        if (!args[0]) {
            let e2 = new MessageEmbed()
                .setDescription(`Please make sure to ping the user. Use \`${config.prefix}${module.exports.help.name} (<@member>) (product id) (email) (discount amount in %)\``)
                .setColor(config.embed.color)
                .setFooter(config.embed.footer)
                .setTimestamp()
            message.channel.send(e2).then(msg => msg.delete({ timeout: 10000 }));
        } else {
            const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
            if (!member) {
                let e3 = new MessageEmbed()
                    .setDescription(`I was not able to find the user you mentioned. Use \`${config.prefix}${module.exports.help.name} (<@member>) (product id) (email) (discount amount in %)\``)
                    .setColor(config.embed.color)
                    .setFooter(config.embed.footer)
                    .setTimestamp()
                message.channel.send(e3).then(msg => msg.delete({ timeout: 10000 }));
            } else {
                let productID = args[1];
                if (isNaN(productID)) {
                    let e4 = new MessageEmbed()
                        .setDescription(`The product must be an ID`)
                        .setColor(config.embed.color)
                        .setFooter(config.embed.footer)
                    message.channel.send(e4).then(msg => msg.delete({ timeout: 25000 }));
                } else {
                    connection.query(`SELECT * FROM products WHERE id = '${productID}'`, async function(err, reslove) {
                        if (reslove[0] === undefined) {
                            let e5 = new MessageEmbed()
                                .setDescription(`I was not able to find the productID for \`${productID}\``)
                                .setColor(config.embed.color)
                                .setFooter(config.embed.footer)
                            message.channel.send(e5).then(msg => msg.delete({ timeout: 25000 }));
                        } else {
                            let email = args[2];
                            if (!email) {
                                let e6 = new MessageEmbed()
                                    .setDescription(`Please make sure to input an email. Use \`${config.prefix}${module.exports.help.name} (<@member>) (product id) (email) (discount amount in %)\``)
                                    .setColor(config.embed.color)
                                    .setFooter(config.embed.footer)
                                message.channel.send(e6).then(msg => msg.delete({ timeout: 25000 }));
                            } else {
                                let discount = args[3];
                                if (!discount) {
                                    let e7 = new MessageEmbed()
                                        .setDescription(`Please make sure to input a discount amount`)
                                        .setColor(config.embed.color)
                                        .setFooter(config.embed.footer)
                                    message.channel.send(e7).then(msg => msg.delete({ timeout: 25000 }));
                                } else {
                                    if (isNaN(discount)) {
                                        let e8 = new MessageEmbed()
                                            .setDescription(`Please make sure the discount amount is a number.`)
                                            .setColor(config.embed.color)
                                            .setFooter(config.embed.footer)
                                        message.channel.send(e8).then(msg => msg.delete({ timeout: 25000 }));
                                    } else {
                                        if (discount > 99 || discount < 1) {
                                            let e9 = new MessageEmbed()
                                                .setDescription(`You cannot give more then 99% discount or below 1%`)
                                                .setColor(config.embed.color)
                                                .setFooter(config.embed.footer)
                                            message.channel.send(e9).then(msg => msg.delete({ timeout: 25000 }));
                                        } else {
                                            let discountprice = reslove[0].price - (reslove[0].price * discount / 100);
                                            let create_invoice_json = {
                                                "merchant_info": {
                                                    "email": config.paypal_info.email,
                                                    "business_name": message.guild.name,
                                                },
                                                "billing_info": [{
                                                    "email": email
                                                }],
                                                "items": [{
                                                    "name": reslove[0].product,
                                                    "quantity": 1.0,
                                                    "unit_price": {
                                                        "currency": "USD",
                                                        "value": reslove[0].price
                                                    },
                                                    "discount": {
                                                        "percent": discount
                                                    },
                                                }],
                                                "logo_url": config.paypal_info.logo,
                                                "note": config.paypal_info.note,
                                                "terms": config.paypal_info.tos,
                                                "payment_term": {
                                                    "term_type": "NET_45"
                                                },
                                                "tax_inclusive": false,
                                                "total_amount": {
                                                    "currency": "USD",
                                                    "value": "500.00"
                                                },

                                            };
                                            client.paypal.invoice.create(create_invoice_json, function(error, invoice) {
                                                if (error) {
                                                    console.log(error)
                                                    let e2 = new MessageEmbed()
                                                        .setTitle(`${message.guild.name} || PayPal Error`)
                                                        .setDescription(`There was an error making the invoice. You have either inputed an invaild email. Also make sure your client and secret are correct.If the issue is still on going contact NAT2K15 for help. [Support server](https://discord.gg/RquDVTfDwu)`)
                                                        .setColor(config.embed.color)
                                                        .setFooter(config.embed.footer)
                                                        .setTimestamp()
                                                    message.channel.send(e2).then(msg => msg.delete({ timeout: 250000 }))
                                                } else {
                                                    let invoiceId = invoice.id;
                                                    client.paypal.invoice.send(invoiceId, function(error, rv) {
                                                        if (error) {
                                                            console.log(error.response);
                                                        } else {
                                                            connection.query(`INSERT INTO paypalbot (discordID, discordTag, descriptions, amount, productid, dateofthepayment, payer_id, email, orderstatus, channel) VALUES ('${member.id}', '${member.user.tag}', '${reslove[0].product}', '${discountprice}', '${productID}', '${new Date()}', '${invoice.id}', '${email}', 'Not Paid', '${message.channel.id}')`)
                                                            let e1 = new MessageEmbed()
                                                                .setTitle(`Payment system | ${message.guild.name}`)
                                                                .addField(`Product`, reslove[0].product, true)
                                                                .addField(`Amount Due`, discountprice, true)
                                                                .addField(`Currency`, `USD`, true)
                                                                .addField(`Invoice ID`, `\`${invoice.id}\``, true)
                                                                .addField(`Link`, `[Pay Here](https://paypal.com/invoice/payerView/details/${invoice.id})`, true)
                                                                .setThumbnail(config.embed.logo)
                                                                .setColor(config.embed.color)
                                                                .setFooter(config.embed.footer)
                                                                .setTimestamp()
                                                            message.channel.send(e1);
                                                        }
                                                    });
                                                }
                                            })
                                        }
                                    }
                                }

                            }
                        }
                    })
                }
            }
        }
    }
}

module.exports.help = {
    name: "discountinvoice",
    category: "paypal",
    aliases: [],
    description: "This will send you an invoice with a discount"
}
