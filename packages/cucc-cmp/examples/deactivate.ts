import { ChannelProtocol } from '../src';
import { options, mobileNoObj, customOptions } from './sample';

const cucccmpChannelProtocal = new ChannelProtocol(options, customOptions);

cucccmpChannelProtocal
  .deactivate(mobileNoObj)
  .catch(err => console.error(err));
