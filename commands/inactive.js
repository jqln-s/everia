import messageService from '../services/messageService.js';

export default {
    data: {
        name: ['inactive'],
        deleteMessage: true,
        description: 'Shortcut for informing user their ticket is closing due to inactivity'
    },
    async execute(message) {
        // Send the response to the user
        const response = 'Hi there! Due to the lack of response for **12 hours**, this ticket will now be closing. Please reopen a ticket if you still need help. If not, we are glad the issue has been resolved. Thank you!';
        await messageService.sendMessage(message, response);
    }        
}