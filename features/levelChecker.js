import { Events } from 'discord.js';

export default (client) => {
    client.on(Events.GuildMemberUpdate, (oldMember, newMember) => {
        if (newMember.roles.cache.has('1323534002107191307') && !oldMember.roles.cache.has('1323534002107191307')) {
            newMember.roles.add('1323519619813740605');
        }

        if (newMember.roles.cache.has('1323534005882060800') && !oldMember.roles.cache.has('1323534005882060800')) {
            newMember.roles.add('1323519642454462496');
        }
    });
}