import { ChannelProtocol } from '../src';
import { options, mobileNoObj, customOptions, redis } from './sample';

const ctccDspChannelProtocol = new ChannelProtocol(
  options,
  customOptions
);

ctccDspChannelProtocol.getStatus(mobileNoObj)
  .then(res => console.log(res))
  .catch(err => console.error(err))
  .finally(() => redis.disconnect());
