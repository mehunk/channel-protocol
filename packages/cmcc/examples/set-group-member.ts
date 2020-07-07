import { ChannelProtocol, SetGroupMemberOperationType } from '../src';
import { options, customOptions, mobileNoObj, redis, groupId } from './sample';

const cmccChannelProtocol = new ChannelProtocol(options, customOptions);

cmccChannelProtocol
  .setGroupMember(mobileNoObj, groupId, SetGroupMemberOperationType.Add)
  .then(res => console.log(res))
  .catch(err => console.error(err))
  .finally(() => redis.disconnect());
