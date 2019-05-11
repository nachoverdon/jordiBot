import { Client, Message } from 'discord.js';

type Command = {
  fn: (msg: Message) => void,
  desc: string
}

type CommandInfo = {
  name: string,
  args: string | null
}

const prefix = '.';
const client = new Client();
const commands = new Map<String, Command>();

export function registerCommand(name: string, desc: string, fn: (msg: Message) => void) {

  commands.set(name, {
    fn: fn,
    desc: desc,
  });

}

export function getCommandInfo(msg: Message): CommandInfo | null {

  if (msg.content.substr(0, prefix.length) !== prefix) return null;

  const to = msg.content.indexOf(' ') !== -1 ? msg.content.indexOf(' ') : undefined;
  const name = msg.content.substring(1, to);
  const args = to ? msg.content.substring(to) : null;

  return {
    name: name,
    args: args
  };

}

client.on('ready', () => {

  console.log(`Logged in as ${client.user.tag}!`);

});

client.on('message', (msg: Message) => {

  const command = getCommandInfo(msg);

  if (command !== null && commands.has(command.name)) {

    commands.get(command.name).fn(msg);

  }

});

client.login('NTc2NTQ3MTc5MzUxNTA2OTgx.XNYOEQ.GG5MjvbwbwDP4c_EABsuC5dPGyw');

function paquito(msg: Message) {
  msg.channel.send('Rajao!!!');
}

registerCommand('paquito', 'Llamadme rajao si quereis...', paquito);

function help(msg: Message) {
  let cmds = '';

  for (const [key, cmd] of commands) {
    cmds += `${prefix}${key} - ${cmd.desc}\n\n`;
  }

  msg.channel.send(`Comandos disp0nibles:\n\`\`\`${cmds}\`\`\``);
}

registerCommand('help', 'Muestra los comandos disponibles', help);