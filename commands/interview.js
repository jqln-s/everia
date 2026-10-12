import messageService from '../services/messageService.js';

export default {
    data: {
        name: ['interview'],
        deleteMessage: true,
        botType: 'Application',
        description: 'Shortcut for inviting applicants to an interview'
    },
    async execute(message) {
        // Send the response to the user
        const response = 'Hi there! We are thrilled to invite you to interview with our team. This interview will take approximately **15-20 minutes** and will be in **voice chat**. Accommodations can be made if this is not possible for you. To schedule an interview, please send a variety of times that you are available **within the next week (7 days)**, using https://sesh.fyi/timestamp/.\n\nOnce you do that, we\'ll internally see who is free and get back to you as soon as possible. We look forward to speaking with you soon!';
        messageService.sendMessage(message, response);
    }        
}
