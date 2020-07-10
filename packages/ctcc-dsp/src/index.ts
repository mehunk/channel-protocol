import * as moment from 'moment';
import {
  CtccDspIotClient,
  Options as SDKOptions,
  CustomOptions,
  RestClientMobileNoType,
  GlobalSoapClientMobileNoType,
  Status as SDKStatus,
  GetUsageType,
  OperationType,
  DetailGroup
} from '@china-carrier-iot-sdk/ctcc-dsp';

import { Status, ChannelProtocol, Options, MobileNoObj } from './typings';
import config from './config';

const statusMap = {
  [SDKStatus.Deactivated]: Status.Deactivated,
  [SDKStatus.Active]: Status.Activated,
  [SDKStatus.Pause]: Status.Paused,
  [SDKStatus.Terminated]: Status.Retired // 还能挽救
};

class CtccDspChannelProtocol implements ChannelProtocol {
  private readonly options: SDKOptions;
  private readonly client: CtccDspIotClient;

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
    this.client = new CtccDspIotClient(this.options, this.customOptions);
  }

  public async getStatus(mobileNoObj: MobileNoObj): Promise<Status> {
    const res = await this.client.getDetail(GlobalSoapClientMobileNoType.iccid, mobileNoObj.iccid);
    return statusMap[res.simSubscriptionStatus];
  }

  public async getUsage(mobileNoObj: MobileNoObj): Promise<number> {
    const res = await this.client.getUsage(
      RestClientMobileNoType.iccid,
      mobileNoObj.iccid,
      moment().format('YYYY-MM'),
      '1',
      moment()
        .date()
        .toString(),
      [GetUsageType.GPRS]
    );
    return Math.ceil(res.totalVolumnGPRS / 1024);
  }

  public async activate(mobileNoObj: MobileNoObj): Promise<void> {
    await this.client.setStatus(GlobalSoapClientMobileNoType.iccid, mobileNoObj.iccid, OperationType.Activate);
  }

  public async deactivate(mobileNoObj: MobileNoObj): Promise<void> {
    await this.client.setStatus(GlobalSoapClientMobileNoType.iccid, mobileNoObj.iccid, OperationType.Pause);
  }

  public async reactivate(mobileNoObj: MobileNoObj): Promise<void> {
    await this.client.setStatus(GlobalSoapClientMobileNoType.iccid, mobileNoObj.iccid, OperationType.Activate);
  }

  public async getRealNameStatus(mobileNoObj: MobileNoObj): Promise<boolean> {
    const res = await this.client.getRealNameStatus(RestClientMobileNoType.iccid, mobileNoObj.iccid);
    return res.isAuth;
  }

  public async getDeviceSeparateStatus(mobileNoObj: MobileNoObj): Promise<string> {
    const res = await this.client.getRestDetail(GlobalSoapClientMobileNoType.iccid, mobileNoObj.iccid, [ DetailGroup.lockStateInfo ]);
    if (res.lockState === 'UNLOCKED') {
      return 'notSeparated';
    } else if (res.lockState === 'LOCKED') {
      return 'separated';
    } else {
      return 'unknown';
    }
  }

  public async unbindImei(mobileNoObj: MobileNoObj, customerNo: string, customerName: string, customerPhone: string): Promise<void> {
    await this.client.unbindImei(mobileNoObj.iccid, customerNo, customerName, customerPhone);
  }
}

export {
  CtccDspChannelProtocol as ChannelProtocol,
  config
}
