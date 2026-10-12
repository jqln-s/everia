import messageService from '../services/messageService.js';

export default {
    data: {
        name: ['reject-underage'],
        deleteMessage: true,
        botType: 'Application',
        description: 'Shortcut for rejecting applicants due to age'
    },
    async execute(message) {
        // Send the response to the user
        const response = 'Hi there, we are unable to hire you for the team you applied for as you do not fit our age requirement of 16+ at this time. We encourage you to reapply once you fulfill the requirements. Thank you for your interest in this position, and have a lovely day! This application will now be closing.';
        messageService.sendMessage(message, response);
    }        
}