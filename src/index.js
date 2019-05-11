const Discord = require('discord.js');
const client = new Discord.Client();

const commands = {
    paquito: {
      fn: paquito,
      desc: 'Llamadme rajao si quereis...'
    },
    help: {
      fn: help,
      desc: 'Muestra los comandos disponibles'
    }
};

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
  if (msg.content[0] !== '!') return;

  const command = msg.content.substring(1);

  if (commands.hasOwnProperty(command)) {
    commands[command].fn(msg);
  }

});

client.login('NTc2NTQ3MTc5MzUxNTA2OTgx.XNYOEQ.GG5MjvbwbwDP4c_EABsuC5dPGyw');

function paquito(msg) {
  msg.channel.send('Rajao!!!');
}

function help(msg) {
  let cmds = '';

  for (let key in commands) {
    cmds += `!${key} - ${commands[key].desc}\n\n`;
  }

  msg.channel.send(`Comandos disp0nibles:\n\`\`\`${cmds}\`\`\``);
}