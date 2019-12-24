import { CmccIotClient, MobileNoType, OperationType, Options, CustomOptions, Status as SDKStatus } from '@china-carrier-iot-sdk/cmcc';

import { Status, ChannelProtocol } from './typings/global';
import config from './config'

const statusMap = {
  [SDKStatus.TestReady]: Status.TestReady,
  [SDKStatus.Inventory]: Status.Inventory,
  [SDKStatus.ActivationReady]: Status.ActivationReady,
  [SDKStatus.Activated]: Status.Activated,
  [SDKStatus.Deactivated]: Status.Deactivated,
  [SDKStatus.Retired]: Status.Retired,
  [SDKStatus.Purged]: Status.Purged
};

class CmccChannelProtocol implements ChannelProtocol {
  private readonly client: CmccIotClient;

  constructor(options: Options, customOptions: CustomOptions = {}) {
    this.client = new CmccIotClient(options, customOptions);
  }

  public async getStatus(iccid: string): Promise<Status> {
    const res = await this.client.getStatus(MobileNoType.iccid, iccid);
    return statusMap[res.cardStatus];
  }

  public async getUsage(iccid: string): Promise<number> {
    const res = await this.client.getUsage(MobileNoType.iccid, iccid);
    return Math.ceil(+res.dataAmount); // dataAmount 属性可能是小数，目前协议只要整数
  }

  public async activate(iccid: string): Promise<void> {
    await this.client.setStatus(MobileNoType.iccid, iccid, OperationType.Inventory2Activated);
  }

  public async deactivate(iccid: string): Promise<void> {
    await this.client.setStatus(MobileNoType.iccid, iccid, OperationType.Activated2Deactivated);
  }

  public async reactivate(iccid: string): Promise<void> {
    await this.client.setStatus(MobileNoType.iccid, iccid, OperationType.Deactivated2Activated);
  }
}

export {
  CmccChannelProtocol as ChannelProtocol,
  config
};
