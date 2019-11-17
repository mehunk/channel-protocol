import { CmccIotClient, MobileNoType, OperationType, Options, Status as SDKStatus } from '@china-carrier-iot-sdk/cmcc';

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

  constructor(appId: string, password: string, rootEndpoint: string) {
    const options: Options = {
      appId,
      password,
      rootEndpoint
    };
    this.client = new CmccIotClient(options);
  }

  public async getStatus(iccid: string): Promise<Status> {
    const res = await this.client.getStatus(MobileNoType.iccid, iccid);
    return statusMap[res.cardStatus];
  }

  public async getUsage(iccid: string): Promise<number> {
    const res = await this.client.getUsage(MobileNoType.iccid, iccid);
    return +res.dataAmount;
  }

  public async activate(iccid: string): Promise<void> {
    await this.client.setStatus(MobileNoType.iccid, iccid, OperationType.Inventory2Activated);
  }

  public async pause(iccid: string): Promise<void> {
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
