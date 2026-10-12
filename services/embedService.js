import { EmbedBuilder } from 'discord.js';
import { formatTime, calculateTime } from '../util/timeUtils.js';

export default {
    // Create an embed for staff with ticket details
    createStaffEmbed(message, member, text) {
        let title;
        if (process.env.BOT_TYPE == "Higher Up") {
            title = '**Higher Up Support Ticket ・❀˖°**';
        } else if (process.env.BOT_TYPE == "General") {
            title = '**Support Ticket ・❀˖°**';
        } else {
            title = '**Application Ticket ・❀˖°**';
        }
        
        return new EmbedBuilder()
            .setColor(0xfa97b6) // Set embed color
            .setTitle(title) // Title of the embed
            .setAuthor({ name: message.author.username, iconURL: message.author.avatarURL() }) // Set author details
            .addFields(
                { name: 'Joined', value: `**${formatTime(calculateTime(member.joinedTimestamp))}** ago`, inline: true }, // Display how long the user has been in the server
                { name: 'User ID', value: `**${message.author.id}**`, inline: true }, // Display the user's ID
                {
                    name: '\u200B', // Empty field for formatting
                    value: '**Reply:** Use `!reply <message>` to reply\n' + 
                        '**Alert:** Use `!alert` to get a ping when the user responds\n' +
                        '**Close:** Use `!close [duration]` to close the ticket\n' +
                        '**Edit:** Use `!edit <messageNumber> <newMessage>` to edit a message\n' +
                        '**Delete:** Use `!delete <messageNumber>` to delete a message' // Command instructions
                }
            )
            .setImage('https://i.imgur.com/EfB9Xlf.png') // Image in the embed
            .setFooter({ text }); // Footer with additional information
    },

    // Create an embed for the user opening a ticket
    createUserEmbed() {
        const generalEmbed = new EmbedBuilder()
            .setColor(0xfa97b6) // Set embed color
            .setTitle('**Support Ticket ・❀˖°**') // Title of the embed
            .setDescription(
                'You\'ve successfully opened a **support ticket**! Please wait patiently for one of our staff members to respond.\n\n' +
                'If you haven\'t already, please provide the following information:\n' +
                '<:SMP_pinkdot:1554345656548597850> The problem you need help with\n' +
                '<:SMP_reddot:1554345617109684294> Your Minecraft username (if this relates to an in-game issue)\n' +
                '<:SMP_yellowdot:1554345683744722984> Any other relevant information we might need, including photos or proof of the issue occuring\n\n' +
                '-# These tickets are best for general questions, concerns, small issues, and player reports. If you have a more serious report such as a glitch, plugin issue, store issue, or staff report, please make a **higher up ticket** instead.'
            )
            .setImage('https://i.imgur.com/EfB9Xlf.png'); // Image in the embed
    
        const higherUpEmbed = new EmbedBuilder()
            .setColor(0xfa97b6) // Set embed color
            .setTitle('**Higher Up Support Ticket ・❀˖°**') // Title of the embed
            .setDescription(
                '**You\'ve successfully opened a higher up support ticket!** Please wait patiently for one of our staff members to respond.\n\n' +
                'If you haven\'t already, please provide the following information:\n' +
                '<:SMP_pinkdot:1554345656548597850> The problem you need help with\n' +
                '<:SMP_reddot:1554345617109684294> Your Minecraft username (if this relates to an in-game issue)\n' +
                '<:SMP_yellowdot:1554345683744722984> Any other relevant information we might need, including photos or proof of the issue occuring\n\n' +
                '-# Please note that only **Admin+** can see your concerns. If your ticket involves a player report, small issue, or general questions and concerns please make a support ticket instead, as you will receive faster help there. Thank you!'
            )
            .setImage('https://i.imgur.com/EfB9Xlf.png'); // Image in the embed

        const applicationEmbed = new EmbedBuilder()
            .setColor(0xfa97b6) // Set embed color
            .setTitle('**Application Ticket ・❀˖°**') // Title of the embed
            .setDescription(
                'Thanks for your interest in applying to our team. If you haven\'t already, please ensure you send your application via **Google Docs share link __only__**, with the visibility enabled so anyone with the link can view. We are unable to review any other format at this time.\n\n' +
                'Our team will get back to you within **3-5 days** with an offer, rejection or an interview, depending on the application type you submitted! If you have any questions about your application, feel free to ask those. <:wildflowermc_gtulips:1389085061734727744>'
            )
            .setImage('https://i.imgur.com/EfB9Xlf.png'); // Image in the embed
    
        // Return the appropriate embed based on the BOT_TYPE environment variable
        if (process.env.BOT_TYPE == 'General') {
            return generalEmbed;
        } else if (process.env.BOT_TYPE == 'Higher Up') {
            return higherUpEmbed;
        } else {
            return applicationEmbed;
        }
    }
};