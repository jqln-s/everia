import { EmbedBuilder } from 'discord.js';
import { formatTime, calculateTime } from '../util/timeUtils.js';

export default {
    // Create an embed for staff with ticket details
    createStaffEmbed(message, member, text) {
        return new EmbedBuilder()
            .setColor(0x2b2d31) // Set embed color
            .setTitle('**Support Ticket ⋆ ｡˚ ⋆**') // Title of the embed
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
            .setImage('https://i.imgur.com/8fD0ASX.png') // Image in the embed
            .setFooter({ text }); // Footer with additional information
    },

    // Create an embed for the user opening a ticket
    createUserEmbed() {
        const generalEmbed = new EmbedBuilder()
            .setColor(0x2b2d31) // Set embed color
            .setTitle('**Support Ticket ⋆ ｡˚ ⋆**') // Title of the embed
            .setDescription(
                'You\'ve successfully opened a support ticket! Please wait patiently for one of our staff members to respond.\n\n' +
                'If you haven\'t already, please provide the following information:\n' +
                '<:Everia_Dot:1322411330774241340> The problem you need help with\n' +
                '<:Everia_PinkDot:1322411242756898826> Your Minecraft username\n' +
                '<:Everia_Dot:1322411330774241340> Your Discord username\n' +
                '<:Everia_PinkDot:1322411242756898826> Any other relevant information we might need\n\n' +
                '-# Please note that all of the support team can see your concerns. <:Everia_Sparkles:1322328148624412792>'
            )
            .setImage('https://i.imgur.com/8fD0ASX.png'); // Image in the embed
    
        const higherUpEmbed = new EmbedBuilder()
            .setColor(0x2b2d31) // Set embed color
            .setTitle('**Higher Up Support Ticket ⋆ ｡˚ ⋆**') // Title of the embed
            .setDescription(
                'You\'ve successfully opened a higher up support ticket! Please wait patiently for one of our staff members to respond.\n\n' +
                'If you haven\'t already, please provide the following information:\n' +
                '<:Everia_Dot:1322411330774241340> The problem you need help with\n' +
                '<:Everia_PinkDot:1322411242756898826> Your Minecraft username\n' +
                '<:Everia_PinkDot:1322411242756898826> Any other relevant information we might need\n' +
                '<:Everia_Dot:1322411330774241340> Your Discord username\n\n' +
                '-# Please note that only Admin+ can see your concerns. If your ticket involves a player report, small issue, or general questions and concerns please make a support ticket instead. '
            )
            .setImage('https://i.imgur.com/8fD0ASX.png'); // Image in the embed
    
        // Return the appropriate embed based on the BOT_TYPE environment variable
        return process.env.BOT_TYPE === 'General' ? generalEmbed : higherUpEmbed;
    }
};