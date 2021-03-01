const config = require('../../config.json');
const { MessageEmbed } = require('discord.js');

module.exports.run = async(client, message, args) => {
    message.delete()
    if (!message.member.roles.cache.some(r => config.perms_info.support_roles.includes(r.id))) {
        let e1 = new MessageEmbed()
            .setDescription(`You cannot use this command`)
            .setColor(config.embed.color)
            .setFooter(config.embed.footer)
        message.channel.send(e1).then(msg => msg.delete({ timeout: 10000 }));
    } else {
        let userID = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if (!userID) {
            let e2 = new MessageEmbed()
                .setDescription(`Please make sure to input a vaild member ID. Use ${config.prefix}${module.exports.help.name} @user`)
                .setColor(config.embed.color)
                .setFooter(config.embed.footer)
            message.channel.send(e2).then(msg => msg.delete({ timeout: 25000 }));
        } else {
            connection.query(`SELECT * FROM paypalbot WHERE discordId = '${userID.id}' AND hasitbeensent = '1'`, async function(err, reslove) {
                if (err) {
                    let e3 = new MessageEmbed()
                        .setDescription(`I was not able to find any orders for ${userID} || ${userID.id}`)
                        .setColor(config.embed.color)
                        .setFooter(config.embed.footer)
                    message.channel.send(e3).then(msg => msg.delete({ timeout: 25000 }))
                } else {
                    if (reslove == '' || reslove === undefined) {
                        let e4 = new MessageEmbed()
                            .setDescription(`I was not able to find any orders for ${userID} || ${userID.id}`)
                            .setColor(config.embed.color)
                            .setFooter(config.embed.footer)
                            .setTimestamp()
                        message.channel.send(e4).then(msg => msg.delete({ timeout: 25000 }))
                    } else {
                        let num = 1;
                        let embed = new MessageEmbed();
                        embed.setColor(config.embed.color)
                        embed.setFooter(config.embed.footer)
                        embed.setTitle(`Showing all the products ${userID.user.tag} has bought!`)
                        reslove.forEach(eachvalue => {
                            embed.addField(`Product #${num++}`, eachvalue.descriptions, true)
                        })
                        embed.setTimestamp()
                        message.channel.send(embed)
                    }
                }
            })
        }
    }
}

module.exports.help = {
    name: "checkdiscord",
    category: "pa",
    aliases: [],
    description: "This will check what a user bought within the server"
}