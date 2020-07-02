import { CuccCmpClient, Options, CustomOptions, Status as SDKStatus } from '@china-carrier-iot-sdk/cucc-cmp';

import config from './config';
import { Status, ChannelProtocol, MobileNoObj } from './typings';

const statusMap = {
  [SDKStatus.TestReady]: Status.TestReady,
  [SDKStatus.Inventory]: Status.Inventory,
  [SDKStatus.ActivationReady]: Status.ActivationReady,
  [SDKStatus.Activated]: Status.Activated,
  [SDKStatus.Deactivated]: Status.Deactivated,
  [SDKStatus.Replaced]: Status.Replaced,
  [SDKStatus.Retired]: Status.Retired,
  [SDKStatus.Purged]: Status.Purged
};

class CuccCmpChannelProtocol implements ChannelProtocol {
  private readonly client: CuccCmpClient;

  constructor(
    private options: Options,
    private customOptions: CustomOptions = {}
  ) {
    this.client = new CuccCmpClient(this.options, this.customOptions);
  }

  public async getStatus(mobileNoObj: MobileNoObj): Promise<Status> {
    const res = await this.client.getDetail(mobileNoObj.iccid);
    return statusMap[res.simStatus];
  }

  public async getUsage(mobileNoObj: MobileNoObj): Promise<number> {
    const res = await this.client.getDetail(mobileNoObj.iccid);
    return Math.ceil((+res.monthToDateUsage) * 1024); // MB to KB
  }

  public async activate(mobileNoObj: MobileNoObj): Promise<void> {
    await this.client.setDetail(mobileNoObj.iccid, '3', SDKStatus.Activated);
  }

  public async deactivate(mobileNoObj: MobileNoObj): Promise<void> {
    await this.client.setDetail(mobileNoObj.iccid, '3', SDKStatus.Deactivated);
  }

  public async reactivate(mobileNoObj: MobileNoObj): Promise<void> {
    await this.client.setDetail(mobileNoObj.iccid, '3', SDKStatus.Activated);
  }

  public async getRealNameStatus(mobileNoObj: MobileNoObj): Promise<boolean> {
    const res = await this.client.getDetail(mobileNoObj.iccid);
    // 0: 不需实名未实名, 1: 需要实名未实名, 2: 需要实名已实名, 3: 不需要实名已实名
    return res.realNameStatus === '2' || res.realNameStatus === '3'
  }
}

export {
  CuccCmpChannelProtocol as ChannelProtocol,
  config
}
