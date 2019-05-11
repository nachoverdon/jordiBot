import { Client, Message } from 'discord.js';
import { Kayn, REGIONS } from 'kayn';

type Command = {
  fn: (msg: Message) => void,
  desc: string
}

type CommandInfo = {
  name: string,
  args: string | null
}

const prefix = '.';
const commands = new Map<String, Command>();
const client = new Client();
const kayn = Kayn(process.env.RIOT_API_KEY)({
  region: REGIONS.EUROPE_WEST,
  requestOptions: {
    burst: true
  }
});

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

client.login(process.env.DISCORD_TOKEN);

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

async function elo(msg: Message) {
  let message = '';
  const summoner = getCommandInfo(msg).name;

  const summonerData = await kayn.SummonerV4.by.name(summoner);

  if (!summonerData.name) {
    message = `No se ha podido encontrar datos de ${summoner}`;
  }

  const res = await kayn.LeagueV4.by.uuid(summonerData.id);

  message = res.toString();

  msg.channel.send(message);
}