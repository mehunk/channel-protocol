export default {
  name: '中国移动物联网基地',
  carrier: '移动',
  alias: 'CmccChannelProtocol',
  params: [
    {
      name: '应用 id',
      alias: 'appId',
      type: 'text'
    },
    {
      name: '密码',
      alias: 'password',
      type: 'text'
    },
    {
      name: '接口根端点',
      alias: 'rootEndpoint',
      type: 'text',
      default: 'https://api.iot.10086.cn/v5/ec'
    }
  ],
  billingCycleStartDay: 1,
  supportSpeedLimit: false
};
