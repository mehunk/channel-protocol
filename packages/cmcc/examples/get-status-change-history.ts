import { ChannelProtocol } from '../src';
import { options, customOptions, iccid, redis } from './sample';

const cmccChannelProtocol = new ChannelProtocol(options, customOptions);

cmccChannelProtocol
  .getStatusChangeHistory(iccid)
  .then(res => console.log(res))
  .catch(err => console.error(err))
  .finally(() => redis.disconnect());
