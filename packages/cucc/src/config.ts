export default {
  name: '中国联通物联网基地',
  carrier: '联通',
  alias: 'CuccChannelProtocol',
  params: [
    {
      name: 'Jasper 用户名',
      alias: 'jasperUsername',
      type: 'text'
    },
    {
      name: 'Jasper Key',
      alias: 'JasperKey',
      type: 'text'
    },
    {
      name: 'Jasper 接口根端点',
      alias: 'jasperRootEndpoint',
      type: 'text',
      default: 'https://api.10646.cn/rws/api/v1'
    },
    {
      name: 'CMP appId',
      alias: 'cmpAppId',
      type: 'text'
    },
    {
      name: 'CMP secret',
      alias: 'cmpAppSecret',
      type: 'text'
    },
    {
      name: 'CMP 接口根端点',
      alias: 'cmpRootEndpoint',
      type: 'text'
    }
  ],
  supportSpeedLimit: false
};
