import messageService from '../services/messageService.js';

export default {
    data: {
        name: ['higherup'],
        deleteMessage: true,
        description: 'Shortcut for redirecting a user to a Higher Up ticket'
    },
    async execute(message) {
        // Send the response to the user
        const response = 'Thank you for submitting a ticket today. This issue will need a higher up to resolve it, so please wait patiently while they are alerted of the ticket. They will handle it as soon as they are available! If you need anything in the meantime, feel free to ask.';
        messageService.sendMessage(message, response);
    }        
}