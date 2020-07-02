import { ChannelProtocol } from '../src';
import { options, mobileNoObj, customOptions } from './sample';

const cucccmpChannelProtocal = new ChannelProtocol(options, customOptions);

cucccmpChannelProtocal
  .activate(mobileNoObj)
  .catch(err => console.error(err));
