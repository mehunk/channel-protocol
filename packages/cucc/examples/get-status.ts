import { ChannelProtocol } from '../src';
import { options, iccid, customOptions } from './sample';

const cuccChannelProtocal = new ChannelProtocol(options, customOptions);

cuccChannelProtocal
  .getStatus(iccid)
  .then(res => console.log(res))
  .catch(err => console.error(err));
