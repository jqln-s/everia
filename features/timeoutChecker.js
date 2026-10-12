import Timeout from '../schemas/timeout.js';
import TicketLog from '../schemas/ticketLog.js';
import { EmbedBuilder } from 'discord.js';
import alertStore from '../util/alertStore.js';

export default async (client) => {
    // Check timeouts every minute
    setInterval(checkTimeout, 1000 * 60);

    // Define embeds to be sent to user
    const thumbnailEmbed = new EmbedBuilder()
        .setColor(0xfa97b6)
        .setImage('https://imgur.com/LOaj74d.png');
    const generalEmbed = new EmbedBuilder()
        .setColor(0xfa97b6)
        .setTitle('**Support Ticket ・❀˖°**')
        .setDescription('**Your ticket has now been closed.** If you need to make a new ticket, just dm this bot again and it will open a new one. Thank you for playing **Wildflower**, we hope you have a farm-tastic day! <:wildflowermc_gtwohearts:1389084052367347772>')
        .setImage('https://i.imgur.com/EfB9Xlf.png');
    const higherUpEmbed = new EmbedBuilder()
        .setColor(0xfa97b6)
        .setTitle('**Higher Up Support Ticket ・❀˖°**')
        .setDescription('**Your ticket has now been closed.** If you need to make a new ticket, just dm this bot again and it will open a new one. Thank you for playing **Wildflower**, we hope you have a farm-tastic day! <:wildflowermc_gtwohearts:1389084052367347772>')
        .setImage('https://i.imgur.com/EfB9Xlf.png');
    const applicationEmbed = new EmbedBuilder()
        .setColor(0xfa97b6)
        .setTitle('**Application Ticket ・❀˖°**')
        .setDescription('**Thanks again for your interest in the position!** If you did not receive the position, you may reapply in 2 weeks. If you did receive the position, follow the instructions of your lead to get trained for the role. Thank you and have a farm-tastic day! <:wildflowermc_csunflowers:1389085065723646123>')
        .setImage('https://i.imgur.com/EfB9Xlf.png');


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
                    if (process.env.BOT_TYPE == "General") {
                        await user.send({ embeds: [thumbnailEmbed, generalEmbed] });
                    } else if (process.env.BOT_TYPE == "Higher Up") {
                        await user.send({ embeds: [thumbnailEmbed, higherUpEmbed] });
                    } else {
                        await user.send({ embeds: [thumbnailEmbed, applicationEmbed] });
                    }
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
                await alertStore.removeAlerts(timeout.ticket_id);
                // Delete the timeout 
                await Timeout.deleteOne({ ticket_id: timeout.ticket_id, ticket_type: process.env.BOT_TYPE });
            } catch (error) {
                channel.send('Failed to delete channel');
                console.error('Failed to delete channel:', error);
            }
        }
    }
}
