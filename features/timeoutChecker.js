import Timeout from '../schemas/timeout.js';
import TicketLog from '../schemas/ticketLog.js';
import { EmbedBuilder } from 'discord.js';

export default async (client) => {
    // Check timeouts every minute
    setInterval(checkTimeout, 1000 * 60);

    // Define embeds to be sent to user
    const thumbnailEmbed = new EmbedBuilder()
        .setColor(0x2b2d31)
        .setImage('https://i.imgur.com/9Y2z1J3.png');
    const userEmbed = new EmbedBuilder()
        .setColor(0x2b2d31)
        .setTitle('**Support Ticket ⋆ ｡˚ ⋆**')
        .setDescription('Your ticket has now been closed. Feel free to make a new ticket by dming this bot if you have any further concerns. As always, thank you for playing Everia and have a magical day! <:Everia_Sparkles:1322328148624412792>')
        .setImage('https://i.imgur.com/8fD0ASX.png');


    async function checkTimeout() {
        // Find all active timeouts with a timestamp less than the current time
        const activeTimeouts = await Timeout.find({
            execute_at: {
                $lt: Date.now()
            },
            ticket_type: process.env.BOT_TYPE
        });

        for (const timeout of activeTimeouts) {
            // Get the ticket channel
            const channel = await client.channels.cache.get(timeout.ticket_id) ||
                            await client.channels.fetch(timeout.ticket_id).catch(() => null);

            // Exit if no channel
            if (!channel) {
                console.error('Channel not found.');
                await Timeout.deleteOne({ ticket_id: timeout.ticket_id, ticket_type: process.env.BOT_TYPE });
                continue;
            }

            // Get user to send closing message
            const user = await client.users.cache.get(channel.topic) || 
                         await client.users.fetch(channel.topic).catch(() => null);

            try {
                // Send the closing message if user is found
                if (!user) {
                    console.error('User not found.');
                } else {
                    await user.send({ embeds: [thumbnailEmbed, userEmbed] });
                }
            } catch (error) {
                console.error(error);
                channel.send('Unable to send message to user.');
            }

            try {
                // Update the ticket log in the database
                await TicketLog.findOneAndUpdate(
                    {
                        user_id: channel.topic,
                        ticket_type: process.env.BOT_TYPE,
                        open: true
                    },
                    {
                        open: false
                    }
                );
            } catch (error) {
                channel.send('Failed to update ticket log for user:', channel.topic);
                console.error('Failed to update ticket log for user:', channel.topic, error);
            }

            try {
                await channel.delete(); // Delete the ticket channel
                // Delete the timeout 
                await Timeout.deleteOne({ ticket_id: timeout.ticket_id, ticket_type: process.env.BOT_TYPE });
            } catch (error) {
                channel.send('Failed to delete channel');
                console.error('Failed to delete channel:', error);
            }
        }
    }
}
