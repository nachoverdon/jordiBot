import { registerCommand } from '../index';

registerCommand('paquito', 'Llamadme rajao si quereis...', paquito);

function paquito(msg) {
    msg.channel.send('Rajao!!!');
}
