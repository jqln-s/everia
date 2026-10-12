import messageService from '../services/messageService.js';

export default {
    data: {
        name: ['wait'],
        deleteMessage: true,
        description: 'Shortcut for asking user to wait for a staff member'
    },
    async execute(message) {
        // Send the response to the user
        const response = 'Hi there! Unfortunately no one on our staff team is available at the current moment to look into your ticket, **please be patient with us as the next available staff member will help you as soon as possible**. While you wait, please review all the information provided and add any additional information you think is necessary. Thank you for your patience!';
        messageService.sendMessage(message, response);
    }        
}