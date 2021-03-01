const config = require('../../config.json');
const { MessageEmbed } = require('discord.js');

module.exports.run = async(client, message, args) => {
    connection.query(`SELECT * FROM products`, async function(err, reslove) {
        if (reslove[0] === undefined) {
            let e2 = new MessageEmbed()
                .setDescription(`You do not have any products in the database! To add products to the database use \`${config.prefix}addproduct\``)
                .setColor(config.embed.color)
                .setFooter(config.embed.footer)
            message.channel.send(e2).then(msg => msg.delete({ timeout: 25000 }))
        } else {
            let e3 = new MessageEmbed();
            e3.setTitle(`Product Info | ${message.guild.name}`)
            e3.setColor(config.embed.color)
            e3.setFooter(config.embed.footer)
            reslove.forEach(eachvalue => {
                e3.addField(`Product ID: \`${eachvalue.id}\``, `${eachvalue.product}`, true)
                e3.addField(`Price`, `$${eachvalue.price}`, true)
            })
            message.channel.send(e3)
        }
    })
};

module.exports.help = {
    name: "showproducts",
    category: "db",
    aliases: [],
    description: "This will add a product to the database"
}