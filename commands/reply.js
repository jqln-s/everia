import TicketLog from '../schemas/ticketLog.js';
import alertStore from '../util/alertStore.js';

export default {
    data: {
        name: ['reply', 'r'],
        deleteMessage: true,
        description: 'Sends a response to the user',
        arguments: '<response>'
    },
    async execute(message) {
        const mainServer = message.client.guilds.cache.get(process.env.GUILD_ID);
        
        // Get the response message
        const args = message.content.split(' ');
        args.shift();
        let response = args.join(' ').trim();
        
        // Append attachments
        if (message.attachments) {
            for (const attachment of message.attachments) {
                response += attachment[1].url + ' ';
            }
        }
        
        // Ensure the response is not empty
        if (!response) {
            return message.channel.send('Usage: !reply <response>');
        }

        // Retrieve the user associated with the ticket channel (stored in the channel's topic)
        let user = message.client.users.cache.get(message.channel.topic);
        if (!user) {
            try {
                user = await mainServer.members.fetch(message.channel.topic);
            } catch (error) {
                console.error('Error fetching user from server:', error);
                return message.channel.send('Failed to find the user for this ticket.');
            }
        }

        // Retrieve the ticket log and ensure the ticket exists
        const ticket = await TicketLog.findOne({ user_id: message.channel.topic, ticket_type: process.env.BOT_TYPE, open: true });

        // Generate the next message number for the ticket
        let messageNumber = 'N/A';
        if (ticket) {
            const staffMessages = ticket.messages.filter(msg => msg.message_number !== undefined);
            messageNumber = staffMessages.length > 0 ? staffMessages[staffMessages.length - 1].message_number + 1 : 1;
        }
        
        // Send the response to the user (mentioning the user and including the response)
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
            if (!ticket) {
                staffMessage = await message.channel.send(`\`${messageNumber}\` **${message.author.username}**: ${response}\n-# ㅤ⤷ No ticket found. Response was sent, but not logged. It cannot be edited or deleted.`);
            } else {
                staffMessage = await message.channel.send(`\`${messageNumber}\` **${message.author.username}**: ${response}`);
            }
        } catch (error) {
            console.error('Error sending message to staff channel:', error);
            return message.channel.send('Failed to send the response in the staff channel.');
        }

        try {
            // Register the user's alert in the alert store
            const alertList = await alertStore.addAlert(message.channel.id, message.author.id);

            if (!alertList || !Array.isArray(alertList.user_ids)) {
                // Log error for debugging
                console.error('Alert store returned an invalid response:', alertList);
                return message.channel.send(`Error adding **${message.author.username}** to alert list.`);
            }
            
        } catch (error) {
            console.error('Error executing alert command:', error);
            return message.channel.send(`An unexpected error occurred while processing your request.`);
        }

        if (!ticket) {
            return;
        }

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
