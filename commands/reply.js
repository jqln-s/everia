import messageService from '../services/messageService.js';

export default {
    data: {
        name: ['reply', 'r'],
        deleteMessage: true,
        description: 'Sends a response to the user',
        arguments: '<response>'
    },
    async execute(message) {
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

        // Send the response to the user
        messageService.sendMessage(message, response);
    }        
}
