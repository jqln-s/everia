import messageService from '../services/messageService.js';

export default {
    data: {
        name: ['accept-mod'],
        deleteMessage: true,
        botType: 'Application',
        description: 'Shortcut for accepting applicants for Mod'
    },
    async execute(message) {
        // Send the response to the user
        const response = 'Hello! Thank you so much for choosing to apply and interview with our team, we are **pleased to invite you to the staff team** as a **Mod**.\n\nIf you are still interested in the position, please confirm with us and we can send you over any information required before you begin. As a Mod, you will need to complete a manual training session which will be scheduled in a channel on the staff discord. We are incredibly excited to begin working with you! ';
        messageService.sendMessage(message, response);
    }        
}