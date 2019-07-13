import { Client, Message, User, RichEmbed, Attachment } from 'discord.js';
import { Kayn, REGIONS } from 'kayn';
import { PubgAPI, PlatformRegion, Player, PlayerSeason, Season } from 'pubg-typescript-api';
import * as nekosLife from 'nekos.life';

type Command = {
  fn: (msg: Message) => void,
  desc: string
}

type CommandInfo = {
  name: string,
  args: string | null
}

const PREFIX = '.';
const BT = '```';
const commands = new Map<String, Command>();

const client = new Client();

const kayn = Kayn(process.env.RIOT_API_KEY)({
  region: REGIONS.EUROPE_WEST,
  requestOptions: {
    burst: true
  }
});

const pubgApi = new PubgAPI(process.env.PUBG_API_KEY, PlatformRegion.PC_EU);
const neko = new nekosLife.default();

export function registerCommand(name: string, desc: string, fn: (msg: Message) => void) {

  commands.set(name, {
    fn: fn,
    desc: desc,
  });

}

export function getCommandInfo(msg: Message): CommandInfo | null {

  if (msg.content.substr(0, PREFIX.length) !== PREFIX) return null;

  const to = msg.content.indexOf(' ') !== -1 ? msg.content.indexOf(' ') : undefined;
  const name = msg.content.substring(1, to);
  const args = to ? msg.content.substring(to).trim() : null;

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

function help(msg: Message) {
  let cmds = '';

  for (const [key, cmd] of commands) {
    cmds += `${PREFIX}${key} - ${cmd.desc}\n\n`;
  }

  msg.channel.send(`Comandos disp0nibles:\n${BT}${cmds}${BT}`);
}

registerCommand('help', 'Muestra los comandos disponibles', help);

function paquito(msg: Message) {
  msg.channel.send('Rajao!!!');
}

registerCommand('paquito', 'Llamadme rajao si quereis...', paquito);

async function elo(msg: Message) {
  const summoner = getCommandInfo(msg).args;
  let message = `No se ha podido encontrar datos de ${summoner}`;

  try {
    const summonerData = await kayn.SummonerV4.by.name(summoner);

    if (summonerData.name) {

      const leagues = await kayn.LeaguePositionsV4.by.summonerID(summonerData.id);

      let msg = '';

      for (const lg of leagues) {

        const win = lg.wins, loss = lg.losses;
        const winrate = ((win / (win + loss)) * 100).toFixed(2);

        msg += `${lg.queueType} - ${lg.tier} ${lg.rank} (${lg.leaguePoints})\n`;
        msg += `Wins: ${win} - Losses: ${loss} [Win rate: ${winrate}%]\n\n`;

      }

      message = msg;

    }

  } catch (err) {
    console.log('[ERROR]', err);
  }

  msg.channel.send(message);
}

registerCommand('elo', 'Te dice lo malo que eres al LOL', elo);

async function pubg(msg: Message) {
  const name = getCommandInfo(msg).args;

  let message = `No se ha podido encontrar datos de ${name}`;

  try {
    const request = await Player.filterByName(pubgApi, [name]);
    const player = request[0];
    const seasons = await Season.list(pubgApi);

    const ps = await PlayerSeason.get(pubgApi, player.id, (() => {

      for (const season of seasons) {

        if (season.isCurrentSeason) return season.id;

      }

      return null;

    })());

    let wins = 0;
    let played = 0;

    for (const mode of [ps.soloFPPStats, ps.duoFPPStats, ps.squadFPPStats, ps.soloStats, ps.duoStats, ps.squadStats]) {

      wins += mode.wins;
      played += mode.roundsPlayed;

    }

    const winrate = (wins / played * 100).toFixed(2);
    message = `Total wins: ${wins} - Played: ${played} - Winrate: ${winrate}%`;

  } catch (err) {
    console.log(err);
  }

  msg.channel.send(message);
}

registerCommand('pubg', 'Si creías que eras malo al LOL...', pubg);

async function sendLizard(msg: Message) {
  try {

    await neko.sfw.lizard().then((req) => {

      for (const [key, user] of msg.mentions.users.entries()) {
        if (user.bot) continue;

        msg.client.users.get(key).send(new Attachment(req.url));
      }

    });

    msg.channel.send('LizardExpress agradece que haya elegido nuestros servicios.');

  } catch (err) {
    console.log(err);
    msg.channel.send('Algo no funsionó correctamente.');
  }

}

registerCommand('sendlizard', 'Regala amor al usuario especificado', sendLizard);