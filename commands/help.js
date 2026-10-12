import { EmbedBuilder } from "discord.js";

export default {
    data: {
        name: ['help'],
        deleteMessage: true,
        description: 'Displays a list of commands'
    },
    execute (message) {
        let embedDesc = '';

        for (const [command, object] of message.client.commands) {
            const data = object.data;

            if (data.botType && data.botType !== process.env.BOT_TYPE) continue;
            if (data.permission && !message.member.permissions.has(data.permission)) continue;

            if (data.arguments) {
                embedDesc += `\`!${command[0]} ${data.arguments}\`: ${data.description}\n`;
            } else {
                embedDesc += `\`!${command[0]}\`: ${data.description}\n`;
            }
        }

        const embed = new EmbedBuilder()
            .setColor(0x2b2d31)
            .setTitle('Command List ⋆ ｡˚ ⋆')
            .setDescription(embedDesc)
            .setImage('https://i.imgur.com/8fD0ASX.png');

        message.channel.send({ embeds: [embed] });
    }
}