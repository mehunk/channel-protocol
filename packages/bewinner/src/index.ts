import {
  BewinnerClient,
  CustomOptions,
  MobileNoType,
  Options,
  Status as SDKStatus
} from '@china-carrier-iot-sdk/bewinner';

import { ChannelProtocol, MobileNoObj, Status } from './typings';
import config from './config';

const statusMap = {
  [SDKStatus.TestReady]: Status.TestReady,
  [SDKStatus.ActivationReady]: Status.ActivationReady,
  [SDKStatus.Activated]: Status.Activated,
  [SDKStatus.ExpiredPlanActivated]: Status.Activated,
  [SDKStatus.UserDeactivated]: Status.Deactivated,
  [SDKStatus.OutOfCreditDeactivated]: Status.Deactivated,
  [SDKStatus.ExpiredPlanDeactivated]: Status.Deactivated,
  [SDKStatus.Replaced]: Status.Replaced,
  [SDKStatus.Retired]: Status.Retired,
  [SDKStatus.Purged]: Status.Purged,
  [SDKStatus.Initial]: Status.Unknown,
  [SDKStatus.Handling]: Status.Unknown
};

class BewinnerChannelProtocol implements ChannelProtocol {
  private readonly client: BewinnerClient;

  constructor(options: Options, customOptions: CustomOptions = {}) {
    this.client = new BewinnerClient(options, customOptions);
  }

  public async getStatus(mobileNoObj: MobileNoObj): Promise<Status> {
    const res = await this.client.getStatus(MobileNoType.iccid, mobileNoObj.iccid);
    const status = statusMap[res.status];
    return status || Status.Unknown;
  }

  public async getUsage(mobileNoObj: MobileNoObj): Promise<number> {
    const res = await this.client.getUsage(MobileNoType.iccid, mobileNoObj.iccid);
    if (typeof res.used !== 'number') {
      throw new Error(`返回流量非数字格式！流量值：${res.used}`);
    }
    return Math.ceil(res.used * 1024);
  }

  public async activate(mobileNoObj: MobileNoObj): Promise<void> {
    await this.client.activate(MobileNoType.iccid, mobileNoObj.iccid);
  }

  public async deactivate(mobileNoObj: MobileNoObj): Promise<void> {
    await this.client.deactivate(MobileNoType.iccid, mobileNoObj.iccid,);
  }

  public async reactivate(mobileNoObj: MobileNoObj): Promise<void> {
    await this.client.reactivate(MobileNoType.iccid, mobileNoObj.iccid);
  }

  public async getRealNameStatus(mobileNoObj: MobileNoObj): Promise<boolean> {
    const res = await this.client.getRealNameStatus(MobileNoType.iccid, mobileNoObj.iccid);
    return res.flag;
  }
}

export {
  BewinnerChannelProtocol as ChannelProtocol,
  config
};
