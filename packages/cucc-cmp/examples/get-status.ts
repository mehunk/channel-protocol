import { ChannelProtocol } from '../src';
import { options, mobileNoObj, customOptions } from './sample';

const cucccmpChannelProtocal = new ChannelProtocol(options, customOptions);

cucccmpChannelProtocal
  .getStatus(mobileNoObj)
  .then(res => console.log(res))
  .catch(err => console.error(err));
