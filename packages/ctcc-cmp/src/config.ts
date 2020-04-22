export default {
  name: '中国电信物联网基地-CMP',
  carrier: '电信',
  alias: 'CtccCmpChannelProtocol',
  params: [
    {
      name: 'userId',
      alias: 'userId',
      type: 'text'
    },
    {
      name: '密码',
      alias: 'password',
      type: 'text'
    },
    {
      name: 'key',
      alias: 'key',
      type: 'text'
    },
    {
      name: '接口根端点',
      alias: 'rootEndpoint',
      type: 'text',
      default: 'http://api.ct10649.com:9001/m2m_ec'
    }
  ],
  billingCycleStartDay: 1,
  supportSpeedLimit: false
};
