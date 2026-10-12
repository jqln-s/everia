import { EmbedBuilder } from 'discord.js';
import TicketLog from '../schemas/ticketLog.js';

export default {
    data: {
        name: ['interview'],
        deleteMessage: true,
        botType: 'Higher Up',
        description: 'Shortcut for inviting applicants to an interview'
    },
    async execute(message) {
        const mainServer = message.client.guilds.cache.get(process.env.GUILD_ID);

        // Retrieve the user associated with the ticket channel (stored in the channel's topic)
        let user = await mainServer.members.fetch(message.channel.topic);
        if (!user) {
            return message.channel.send('Failed to find the user associated with this ticket.');
        }

        // Retrieve the ticket log and ensure the ticket exists
        const ticket = await TicketLog.findOne({ user_id: message.channel.topic, ticket_type: process.env.BOT_TYPE, open: true });
        if (!ticket) {
            return message.channel.send('No open ticket found for this channel.');
        }

        // Generate the next message number for the ticket
        const staffMessages = ticket.messages.filter(msg => msg.message_number !== undefined);
        const messageNumber = staffMessages.length > 0 ? staffMessages[staffMessages.length - 1].message_number + 1 : 1;
        
        // Send the response to the user
        const response = 'Hi! After careful consideration, we would love to invite you to interview for our team. Please send us your availability for the next week using the https://sesh.fyi/timestamp/ website. We look forward to interviewing with you shortly.';
        let userMessage;
        try {
            userMessage = await user.send(`**[${message.member.roles.highest.name}]** <@${message.author.id}>: ${response}`);
        } catch (error) {
            console.error('Error sending message to user:', error);
            return message.channel.send('Failed to send the response to the user.');
        }

        // Reply to the interaction in the channel, visible to staff
        let staffMessage;
        try {
            staffMessage = await message.channel.send(`\`${messageNumber}\` **${message.author.username}**: ${response}`);
        } catch (error) {
            console.error('Error sending message to staff channel:', error);
            return message.channel.send('Failed to send the response in the staff channel.');
        }

        const instructionsEmbed = new EmbedBuilder()
            .setColor(0x2b2d31)
            .setDescription('## **Interview ⋆ ｡˚ ⋆**\nYou\'ve offered an interview—great job! Here’s what to do next to get everything ready:\n### **Set up the interview doc**:\n- Make a copy of the [Blank Interview Doc](https://docs.google.com/document/d/1KJX4rUNvVeG_4-KT18ichMQxSDc1QEYGuu6B-o7ohpk/).\n### **Record the interview**:\n- The interview **must be recorded**. If the applicant **does not consent** to being recorded, they **cannot** continue in the hiring process. Make sure to let them know ahead of time.\n### **After the interview**:\n- Move the completed **interview doc** and **interview video** to the [Completed Interviews Folder](https://drive.google.com/drive/folders/1C1kiCLEVrejtlh4kY4ePMWsjUXD5vNkh).\n- Drop both the **interview video** and the **completed doc** into the application ticket so the rest of the team can review it.')
            .setImage('https://i.imgur.com/8fD0ASX.png');

        message.channel.send({ embeds: [instructionsEmbed] });

        // Push the reply to the ticket log
        try {
            await TicketLog.findOneAndUpdate(
                {
                    user_id: message.channel.topic,
                    ticket_type: process.env.BOT_TYPE,
                    open: true
                },
                {
                    $push: {
                        messages: {
                            username: message.author.username,
                            message: response,
                            message_number: messageNumber,
                            user_message_id: userMessage.id,
                            staff_message_id: staffMessage.id,
                            anonymous: false
                        }
                    }
                },
                {
                    upsert: true,
                    new: true
                }
            );
        } catch (error) {
            console.error('Error while updating ticket log:', error);
            return message.channel.send('Failed to update the ticket log, but your message has been sent. This means you cannot edit or delete this message.');
        }
    }        
}
