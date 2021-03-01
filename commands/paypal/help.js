const config = require('../../config.json');
const { MessageEmbed } = require('discord.js');

module.exports.run = async(client, message, args) => {
    let e1 = new MessageEmbed()
        .setTitle(`Help menu for ${client.user.tag}`)
        .setColor(config.embed.color)
        .setFooter(`Made by NAT2K15`)
        .addField(`${config.prefix}addproduct`, `Adds a product to the database`)
        .addField(`${config.prefix}removeproduct`, `Removes a product from the database`)
        .addField(`${config.prefix}showproducts`, `Shows all the products in the database`)
        .addField(`${config.prefix}createinvoice`, `Creates an invoice without a discount`)
        .addField(`${config.prefix}discountinvoice`, `Creates an invoice with a discount`)
        .addField(`${config.prefix}checkinvoice`, `Will check if an invoice has been paid`)
        .addField(`${config.prefix}checkdiscord`, `Checks what a user bought in the database`)
        .setTimestamp()
    message.channel.send(e1)
}

module.exports.help = {
    name: "help",
    category: "db",
    aliases: [],
    description: "help command"
}