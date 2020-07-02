import { ChannelProtocol } from '../src';
import { options, mobileNoObj, customOptions } from './sample';

const cucccmpChannelProtocal = new ChannelProtocol(options, customOptions);

cucccmpChannelProtocal
  .getUsage(mobileNoObj)
  .then(res => console.log(res))
  .catch(err => console.error(err));
