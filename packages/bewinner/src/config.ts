export default {
  name: '北纬通信',
  carrier: '北纬通信',
  alias: 'BewinnerChannelProtocol',
  params: [
    {
      name: '应用 id',
      alias: 'appId',
      type: 'text'
    },
    {
      name: '密钥',
      alias: 'secret',
      type: 'text'
    },
    {
      name: '接口根端点',
      alias: 'rootEndpoint',
      type: 'text',
      default: 'https://ntf-oc.hb-vpc-prod.bwae.org/open-api'
    }
  ],
  billingCycleStartDay: 1,
  supportSpeedLimit: false
};
