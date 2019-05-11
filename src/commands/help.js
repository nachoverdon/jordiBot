import { registerCommand } from '../index';

registerCommand('help', 'Muestra los comandos disponibles', help);

function help(msg) {
    let cmds = '';

    for (let key in commands) {
        cmds += `!${key} - ${commands[key].desc}\n\n`;
    }

    msg.channel.send(`Comandos disp0nibles:\n\`\`\`${cmds}\`\`\``);
}