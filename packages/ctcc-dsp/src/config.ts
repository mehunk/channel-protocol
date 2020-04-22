export default {
  name: '中国电信物联网基地-DSP',
  carrier: '电信',
  alias: 'CtccDspChannelProtocol',
  params: [
    {
      name: 'SOAP 用户名',
      alias: 'soapUsername',
      type: 'text'
    },
    {
      name: 'SOAP 密码',
      alias: 'soapPassword',
      type: 'text'
    },
    {
      name: 'SOAP 接口根端点',
      alias: 'soapRootEndpoint',
      type: 'text',
      default: 'https://global.ct10649.com/dcpapi'
    },
    {
      name: 'REST 用户名',
      alias: 'restUsername',
      type: 'text'
    },
    {
      name: 'REST 密码',
      alias: 'restPassword',
      type: 'text'
    },
    {
      name: 'REST 接口根端点',
      alias: 'restRootEndpoint',
      type: 'text',
      default: 'https://si.global.ct10649.com/api/dcpsiapi'
    }
  ],
  billingCycleStartDay: 1,
  supportSpeedLimit: false
};
