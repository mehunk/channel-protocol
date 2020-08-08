import { ChannelProtocol } from '../src';
import { options, mobileNoObj } from './sample';

const bewinnerChannelProtocol = new ChannelProtocol(options);

bewinnerChannelProtocol.getStatus(mobileNoObj)
  .then(res => console.log(res))
  .catch(err => console.error(err));
