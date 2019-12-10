import { ChannelProtocol } from '../src';
import { options, iccid, customOptions, redis } from './sample';

const ctccChannelProtocol = new ChannelProtocol(
  options,
  customOptions
);

ctccChannelProtocol.getUsage(iccid)
  .then(res => console.log(res))
  .catch(err => console.error(err))
  .finally(() => redis.disconnect());

