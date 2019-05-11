const Discord = require('discord.js');
const client = new Discord.Client();
const commands = {};

export function registerCommand(name, desc, fn) {
  if (typeof name !== 'string' && typeof desc !== 'string' &&
    typeof fn != 'function') return;

  commands[name] = {
    fn: fn,
    desc: desc
  }
}

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

