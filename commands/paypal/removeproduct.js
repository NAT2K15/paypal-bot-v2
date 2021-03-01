const config = require('../../config.json');
const { MessageEmbed } = require('discord.js');

module.exports.run = async(client, message, args) => {
    await message.delete()
    if (!message.member.roles.cache.some(r => config.perms_info.support_roles.includes(r.id))) {
        let e1 = new MessageEmbed()
            .setDescription(`You cannot use this command`)
            .setColor(config.embed.color)
            .setFooter(config.embed.footer)
        message.channel.send(e1).then(msg => msg.delete({ timeout: 10000 }));
    } else {
        let productID = args[0];
        if (!productID) {
            let e2 = new MessageEmbed()
                .setDescription(`Please make sure to input the ID of the product.`)
                .setColor(config.embed.color)
                .setFooter(config.embed.footer)
            message.channel.send(e2).then(msg => msg.delete({ timeout: 25000 }));
        } else {
            if (isNaN(productID)) {
                let e3 = new MessageEmbed()
                    .setDescription(`Please make sure the ID is a number.`)
                    .setColor(config.embed.color)
                    .setFooter(config.embed.footer)
                message.channel.send(e3).then(msg => msg.delete({ timeout: 25000 }));
            } else {
                connection.query(`SELECT * FROM products WHERE id = '${productID}'`, async function(err, reslove) {
                    if (reslove[0] === undefined) {
                        let e4 = new MessageEmbed()
                            .setDescription(`I was not able to find the product ID in the database`)
                            .setColor(config.embed.color)
                            .setFooter(config.embed.footer)
                        message.channel.send(e4).then(msg => msg.delete({ timeout: 25000 }));
                    } else {
                        connection.query(`DELETE FROM products WHERE id = '${productID}'`);
                        let e5 = new MessageEmbed()
                            .setDescription(`I have deleted the product for the ID ${productID}`)
                            .setColor(config.embed.color)
                            .setFooter(config.embed.footer)
                        message.channel.send(e5);
                    }
                })
            }
        }
    }
}

module.exports.help = {
    name: "removeproduct",
    category: "db",
    aliases: [],
    description: "This will remove a product from the database"
}