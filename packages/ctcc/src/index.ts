import * as moment from 'moment';
import {
  CtccIotClient,
  Options,
  RestClientMobileNoType,
  SoapClientMobileNoType,
  Status as SDKStatus,
  GetUsageType,
  OperationType
} from '@china-carrier-iot-sdk/ctcc';

import config from './config';

const statusMap = {
  [SDKStatus.Deactivated]: Status.Inventory, // 暂时将失活状态定义为库存期
  [SDKStatus.Active]: Status.Activated,
  [SDKStatus.Pause]: Status.Deactivated,
  [SDKStatus.Terminated]: Status.Retired // 还能挽救
};

class CtccChannelProtocol implements ChannelProtocol {
  private readonly client: CtccIotClient;

  constructor(
    soapUsername: string,
    soapPassword: string,
    restUsername: string,
    restPassword: string
  ) {
    const options: Options = {
      soap: {
        username: soapUsername,
        password: soapPassword
      },
      rest: {
        username: restUsername,
        password: restPassword
      }
    };
    this.client = new CtccIotClient(options);
    this.client.init();
  }

  public async getStatus(iccid: string): Promise<Status> {
    const res = await this.client.getDetail(SoapClientMobileNoType.iccid, iccid);
    return statusMap[res.simSubscriptionStatus];
  }

  public async getUsage(iccid: string): Promise<number> {
    const res = await this.client.getUsage(
      RestClientMobileNoType.iccid,
      iccid,
      moment().format('YYYY-MM'),
      '1',
      moment()
        .date()
        .toString(),
      [GetUsageType.GPRS]
    );
    return res.totalVolumnGPRS;
  }

  public async activate(iccid: string): Promise<void> {
    await this.client.setStatus(SoapClientMobileNoType.iccid, iccid, OperationType.Activate);
  }

  public async pause(iccid: string): Promise<void> {
    await this.client.setStatus(SoapClientMobileNoType.iccid, iccid, OperationType.Pause);
  }

  public async reactivate(iccid: string): Promise<void> {
    await this.client.setStatus(SoapClientMobileNoType.iccid, iccid, OperationType.Activate);
  }
}

export {
  CtccChannelProtocol as ChannelProtocol,
  config
}
