import { ChannelProtocol } from '../src';
import { options, mobileNoObj, customOptions } from './sample';

const cuccChannelProtocal = new ChannelProtocol(options, customOptions);

cuccChannelProtocal
  .getRealNameStatus(mobileNoObj)
  .then(res => console.log(res))
  .catch(err => console.error(err));
