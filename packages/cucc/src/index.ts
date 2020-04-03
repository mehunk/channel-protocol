import { CuccIotClient, Options as SDKOptions, CustomOptions, Status as SDKStatus } from '@china-carrier-iot-sdk/cucc';

import config from './config';
import { Status, ChannelProtocol, Options } from './typings';

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
  private readonly options: SDKOptions;
  private readonly client: CuccIotClient;

  constructor(
    options: Options,
    private customOptions: CustomOptions = {}
  ) {
    this.options = {
      jasper: {
        username: options.jasperUsername,
        key: options.jasperKey,
        rootEndpoint: options.jasperRootEndpoint
      },
      cmp: {
        appId: options.cmpAppId,
        appSecret: options.cmpAppSecret,
        rootEndpoint: options.cmpRootEndpoint
      }
    }
    this.client = new CuccIotClient(this.options, this.customOptions);
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

  public async deactivate(iccid: string): Promise<void> {
    await this.client.setDetail(iccid, {
      status: SDKStatus.Deactivated
    });
  }

  public async reactivate(iccid: string): Promise<void> {
    await this.client.setDetail(iccid, {
      status: SDKStatus.Activated
    });
  }

  public async getRealNameStatus(iccid: string): Promise<boolean> {
    const res = await this.client.getRealNameStatus(iccid);
    return res.rspcode === '0001'
  }
}

export {
  CuccChannelProtocol as ChannelProtocol,
  config
}
