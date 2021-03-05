const config = require('../../config.json');
const { MessageEmbed } = require('discord.js');
const ms = require('ms');
module.exports.run = async(client, message, args) => {
    await message.delete()
    if (!message.member.roles.cache.some(r => config.perms_info.support_roles.includes(r.id))) {
        let e1 = new MessageEmbed()
            .setDescription(`You cannot use this command`)
            .setColor(config.embed.color)
            .setFooter(config.embed.footer)
        message.channel.send(e1).then(msg => msg.delete({ timeout: 10000 }));
    } else {
        message.channel.send(`Are you ready to start the process? You will be asked questions about the product you are trying to list.`).then(msg => {
            msg.react('❌').then(() => msg.react('✅'));

            const filterE = (reaction, user) => {
                return ['❌', '✅'].includes(reaction.emoji.name) && user.bot == false;
            };

            msg.awaitReactions(filterE, { max: 1, time: ms("20m"), errors: ['time'] }).then(re => {
                const reaction = re.first();
                if (reaction.emoji.name === '❌') {
                    message.channel.bulkDelete(2)
                }
                if (reaction.emoji.name === '✅') {
                    message.channel.send(`What is the product name you are trying to list?`)
                    message.channel.awaitMessages(m => m.author.id == message.author.id, { max: 1 }).then(firstmsg => {
                        let product = firstmsg.first().content;
                        message.channel.send(`Please include the download link.`)
                        message.channel.awaitMessages(m => m.author.id == message.author.id, { max: 1 }).then(secondmsg => {
                            let link = secondmsg.first().content;
                            message.channel.send(`How much is the product going to cost? (do not include the $)`)
                            message.channel.awaitMessages(m => m.author.id == message.author.id, { max: 1 }).then(thirdmsg => {
                                let price = thirdmsg.first().content;
                                message.channel.send(`Are you sure you want to list this product?`)
                                let embed = new MessageEmbed()
                                    .setTitle(`PayPal Listings | ${message.guild.name}`)
                                    .addField(`Product name`, product, true)
                                    .addField(`Price`, price, true)
                                    .addField(`Download link`, `||${link}||`)
                                    .setColor(config.embed.color)
                                    .setFooter(config.embed.footer)
                                message.channel.send(embed).then(mes => {
                                    mes.react('❌').then(() => mes.react('✅'));

                                    const filtere = (reaction, user) => {
                                        return ['❌', '✅'].includes(reaction.emoji.name) && user.bot == false;
                                    };
                                    mes.awaitReactions(filtere, { max: 1, time: ms("20m"), errors: ['time'] }).then(re => {
                                        const reaction = re.first();
                                        if (reaction.emoji.name === '❌') {
                                            message.channel.bulkDelete(9)
                                            message.channel.send(`Product system canceled!`)
                                        }
                                        if (reaction.emoji.name === '✅') {
                                            if (isNaN(price)) {
                                                let e1 = new MessageEmbed()
                                                    .setDescription(`Product system. The price was not a number!`)
                                                    .setColor(config.embed.color)
                                                    .setFooter(config.embed.footer)
                                                message.channel.bulkDelete(9)
                                                message.channel.send(e1).then(msg => msg.delete({ timeout: 25000 }));
                                            } else {
                                                if (!link.toLowerCase().startsWith('https://')) {
                                                    let e2 = new MessageEmbed()
                                                        .setDescription(`Product system has been canceled. Please ensure the download link is in an https:// format`)
                                                        .setColor(config.embed.color)
                                                        .setFooter(config.embed.footer)
                                                    message.channel.bulkDelete(9)
                                                    message.channel.send(e2).then(msg => msg.delete({ timeout: 25000 }));
                                                } else {
                                                    connection.query(`INSERT INTO products (product, price, download_link) VALUES ('${product}', '${price}', '${link}')`)
                                                    connection.query(`SELECT * FROM products WHERE product = '${product}' AND price = '${price}' AND download_link = '${link}'`, async function(err, reslove) {
                                                        let e1 = new MessageEmbed()
                                                            .setTitle(`Database Changed!`)
                                                            .setDescription(`I added the product to the database!`)
                                                            .setColor(config.embed.color)
                                                            .setFooter(config.embed.footer)
                                                        message.channel.bulkDelete(9)
                                                        message.channel.send(e1);
                                                    })
                                                }
                                            }
                                        }
                                    })
                                })
                            })
                        })
                    })
                }
            })
        })
    }
}

module.exports.help = {
    name: "addproduct",
    category: "db",
    aliases: [],
    description: "This will add a product to the database"
}
