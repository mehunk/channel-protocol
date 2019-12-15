export default {
  name: '中国联通物联网基地',
  carrier: '联通',
  alias: 'CuccChannelProtocol',
  params: [
    {
      name: '用户名',
      alias: 'username',
      type: 'text'
    },
    {
      name: 'KEY',
      alias: 'key',
      type: 'text'
    },
    {
      name: '接口根端点',
      alias: 'rootEndpoint',
      type: 'text',
      default: 'https://api.10646.cn/rws/api/v1'
    }
  ],
  supportSpeedLimit: false
};
