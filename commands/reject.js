import messageService from '../services/messageService.js';

export default {
    data: {
        name: ['reject'],
        deleteMessage: true,
        botType: 'Application',
        description: 'Shortcut for rejecting applicants'
    },
    async execute(message) {
        // Send the response to the user
        const response = 'Hi there, we **regret to inform you** that you **have not been hired** for the team you applied for. We appreciate your interest and application, and thank you for any time you spent on this process. If you have any questions about your rejection, please let us know. Otherwise, we will be **closing this application off in 3 hours**.\n\nIf you would ever like to reapply for a team, please **wait at least 2 weeks before reapplying**. Thank you!';
        messageService.sendMessage(message, response);
    }        
}
