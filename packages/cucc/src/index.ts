import { CuccIotClient, Options, Status as SDKStatus } from '@china-carrier-iot-sdk/cucc';

import config from './config';

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

export class CuccChannelProtocol implements ChannelProtocol {
  private readonly client: CuccIotClient;

  constructor(
    username: string,
    key: string
  ) {
    const options: Options = {
      username,
      key
    };
    this.client = new CuccIotClient(options);
  }

  public async getStatus(iccid: string): Promise<Status> {
    const res = await this.client.getDetail(iccid);
    return statusMap[res.status];
  }

  public async getUsage(iccid: string): Promise<number> {
    const res = await this.client.getUsage(iccid);
    return res.ctdDataUsage; // TODO 单位是字节
  }

  public async activate(iccid: string): Promise<void> {
    await this.client.setDetail(iccid, {
      status: SDKStatus.Activated
    });
  }

  public async pause(iccid: string): Promise<void> {
    await this.client.setDetail(iccid, {
      status: SDKStatus.Deactivated
    });
  }

  public async reactivate(iccid: string): Promise<void> {
    await this.client.setDetail(iccid, {
      status: SDKStatus.Activated
    });
  }
}

export {
  CuccChannelProtocol as ChannelProtocol,
  config
}
