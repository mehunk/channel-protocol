import * as moment from 'moment';
import {
  CtccIotClient,
  Options as SDKOptions,
  CustomOptions,
  RestClientMobileNoType,
  SoapClientMobileNoType,
  Status as SDKStatus,
  GetUsageType,
  OperationType
} from '@china-carrier-iot-sdk/ctcc';

import { Status, ChannelProtocol, Options } from './typings';
import config from './config';

const statusMap = {
  [SDKStatus.Deactivated]: Status.Deactivated,
  [SDKStatus.Active]: Status.Activated,
  [SDKStatus.Pause]: Status.Paused,
  [SDKStatus.Terminated]: Status.Retired // 还能挽救
};

class CtccChannelProtocol implements ChannelProtocol {
  private readonly options: SDKOptions;
  private readonly client: CtccIotClient;

  constructor(
    options: Options,
    private customOptions: CustomOptions = {}
  ) {
    this.options = {
      soap: {
        username: options.soapUsername,
        password: options.soapPassword,
        rootEndpoint: options.soapRootEndpoint
      },
      rest: {
        username: options.restUsername,
        password: options.restPassword,
        rootEndpoint: options.restRootEndpoint
      }
    };
    this.client = new CtccIotClient(this.options, this.customOptions);
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

  public async deactivate(iccid: string): Promise<void> {
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
