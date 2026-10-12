import messageService from '../services/messageService.js';

export default {
    data: {
        name: ['reminder'],
        deleteMessage: true,
        description: 'Shortcut for reminding the user of their open ticket'
    },
    async execute(message) {
        // Send the response to the user
        const response = 'Hello again! Just a reminder that this ticket is still open and we are waiting on your response to assist further. Please reply at your earliest convenience, thank you!';
        messageService.sendMessage(message, response);
    }        
}