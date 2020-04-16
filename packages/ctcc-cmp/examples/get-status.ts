import { ChannelProtocol } from '../src';
import { options, mobileNoObj, customOptions, } from './sample';

const ctccCmpChannelProtocol = new ChannelProtocol(
  options,
  customOptions
);

ctccCmpChannelProtocol.getStatus(mobileNoObj)
  .then(res => console.log(res))
  .catch(err => console.error(err));
