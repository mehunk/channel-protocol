import { ChannelProtocol } from '../src';
import { options, customOptions, mobileNoObj, redis } from './sample';

const cmccChannelProtocol = new ChannelProtocol(options, customOptions);

cmccChannelProtocol
  .getUsage(mobileNoObj)
  .then(res => console.log(res))
  .catch(err => console.error(err))
  .finally(() => redis.disconnect());
