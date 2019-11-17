import { ChannelProtocol } from '../src';
import { params, iccid } from './sample';

const cmccChannelProtocol = new ChannelProtocol(params.appId, params.password, params.rootEndpoint);

cmccChannelProtocol
  .getStatus(iccid)
  .then(res => console.log(res))
  .catch(err => console.error(err));
