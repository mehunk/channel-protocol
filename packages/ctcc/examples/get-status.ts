import { ChannelProtocol } from '../src';
import { params, iccid } from './sample';

const ctccChannelProtocol = new ChannelProtocol(
  params.soapUsername,
  params.soapPassword,
  params.restUsername,
  params.restPassword
);

(new Promise(resolve => {
  setTimeout(() => {
    resolve()
  }, 3 * 1000)
})).then(() => ctccChannelProtocol.getStatus(iccid))
  .then(res => console.log(res))
  .catch(err => console.error(err));

