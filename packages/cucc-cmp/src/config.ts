export default {
  name: '中国联通物联网基地蜂窝协议',
  carrier: '联通',
  alias: 'CuccCmpChannelProtocol',
  params: [
    {
      name: 'appId',
      alias: 'appId',
      type: 'text'
    },
    {
      name: 'secret',
      alias: 'appSecret',
      type: 'text'
    },
    {
      name: '创建者 ID',
      alias: 'openId',
      type: 'text'
    },
    {
      name: '接口根端点',
      alias: 'rootEndpoint',
      type: 'text',
      default: 'https://gwapi.10646.cn/api'
    }
  ],
  billingCycleStartDay: 27,
  supportSpeedLimit: false
};
