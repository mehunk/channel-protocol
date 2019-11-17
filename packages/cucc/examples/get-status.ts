import { ChannelProtocol } from '../src';
import { params, iccid } from './sample';

const cuccChannelProtocal = new ChannelProtocol(params.username, params.key);

cuccChannelProtocal
  .getStatus(iccid)
  .then(res => console.log(res))
  .catch(err => console.error(err));
