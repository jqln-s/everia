import { Events, EmbedBuilder } from 'discord.js';
import TicketLog from '../schemas/ticketLog.js';
import alertService from '../services/alertService.js';
import embedService from '../services/embedService.js';
import ticketService from '../services/ticketService.js';
import timeoutStore from '../util/timeoutStore.js';

export default async (client) => {
    // Fetch the servers by ID
    const staffServer = client.guilds.cache.get(process.env.STAFF_ID);
    const mainServer = client.guilds.cache.get(process.env.GUILD_ID);

    client.on(Events.MessageCreate, async (message) => {
        // DMs only
        if (message.guild || message.author.bot) return;

        // Check if there's an existing ticket channel for this user (based on channel topic)
        const existingTicket = staffServer.channels.cache.find(
            channel => channel.topic == message.author.id && channel.parentId == process.env.CATEGORY_ID
        );

        // Append attachments
        let content = message.content;
        if (message.attachments) {
            for (const attachment of message.attachments) {
                content += attachment[1].url + ' ';
            }
        }

        // Reject messages longer than 2000 characters
        if (content.length >= 2000) {
            return message.channel.send("Message must be less than 2000 characters!");
        }

        // Handle existing ticket
        if (existingTicket) {
            try {
                await alertService.sendMessage(existingTicket, content, message.author.id);
                await ticketService.updateTicketLog(message.author.id, message.author.username, content);
            } catch (error) {
                console.error('Error while sending message in existing ticket: ', error);
                message.channel.send('Error occurred while sending message! Try again later.')
            }

            // Cancel timeout when user responds
            if (await timeoutStore.getTimeout(existingTicket.id)) {
                await timeoutStore.deleteTimeout(existingTicket.id);
                existingTicket.send('Timeout cancelled!');
            }

            // React to message to let user know it's been sent
            //message.react('1321210679616606260');

            return;
        }

        // Handle new ticket
        let member = mainServer.members.cache.get(message.author.id);
        if (!member) {
            member = await mainServer.members.fetch(message.author.id);
        }
        if (!member) {
            return message.channel.send('You must be in the main server to create a ticket. discord.gg/everia');
        }

        // Find previous tickets
        let text = 'User has no previous tickets.';
        try {
            // Fetch closed ticket logs for the given user
            const logs = await TicketLog.find({ user_id: message.author.id, open: false });
            if (logs.length != 0) {
                text = `User has ${logs.length} previous tickets. Use !logs ${message.author.id} to see them.`;
            }
        } catch (error) {
            console.error('Error while fetching ticket log: ' + error);
        }

        const thumbnailEmbed = new EmbedBuilder()
            .setColor(0x2b2d31)
            .setImage('https://i.imgur.com/9Y2z1J3.png');
        const staffEmbed = embedService.createStaffEmbed(message, member, text);
        const userEmbed = embedService.createUserEmbed();
        
        // Create a new private channel for the support ticket
        try {
            await staffServer.channels.create({
                name: message.author.username,  // Channel name as the user's username
                parent: process.env.CATEGORY_ID,  // Parent category ID
                topic: message.author.id  // Channel topic set to user ID
            }).then((channel) => {
                try {
                    // Send a confirmation message to the user who opened the ticket
                    message.channel.send({ embeds: [thumbnailEmbed, userEmbed] });

                    // Send the staff embed in the new ticket channel
                    let ping = '<@&1321209517337477222> <@&1321209517211521195>';
                    if (process.env.BOT_TYPE === 'Higher Up') {
                        ping = '<@&1321209517337477223> <@&1321209517337477224>';
                    }
                    
                    channel.send({ embeds: [thumbnailEmbed, staffEmbed], content: ping });
                    channel.send(`<@${message.author.id}>: ${content}`);
                } catch (error) {
                    console.error('Error sending message: ', error);
                    message.channel.send('Error occurred while sending message! Try again later.');
                }
            });
        } catch (error) {
            console.error('Error creating ticket channel: ', error);
            message.channel.send('An error occurred while creating the ticket. Please contact an admin.');
        }

        // Create new ticket log
        await ticketService.createTicketLog(message.author.id, message.author.username, content);
    });
}
