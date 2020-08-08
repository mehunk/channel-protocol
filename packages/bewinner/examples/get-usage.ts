import { ChannelProtocol } from '../src';
import { options, mobileNoObj } from './sample';

const bewinnerChannelProtocol = new ChannelProtocol(options);

bewinnerChannelProtocol.getUsage(mobileNoObj)
  .then(res => console.log(res))
  .catch(err => console.error(err));
