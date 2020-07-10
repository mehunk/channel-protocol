import { ChannelProtocol } from '../src';
import { options, mobileNoObj, customOptions, redis } from './sample';

const ctccDspChannelProtocol = new ChannelProtocol(
  options,
  customOptions
);

ctccDspChannelProtocol.unbindImei(mobileNoObj, '57000077', '张强', '13903234828')
  .then(res => console.log(res))
  .catch(err => console.error(err))
  .finally(() => redis.disconnect());
