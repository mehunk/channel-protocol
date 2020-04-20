import * as EventEmitter from 'events';

import { CuccIotClient, Options as SDKOptions, CustomOptions, Status as SDKStatus, EventParams, EventResponse } from '@china-carrier-iot-sdk/cucc';

import config from './config';
import { Status, ChannelProtocol, Options, MobileNoObj } from './typings';

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

export class CuccChannelProtocol extends EventEmitter implements ChannelProtocol {
  private readonly options: SDKOptions;
  private readonly client: CuccIotClient;

  constructor(
    options: Options,
    private customOptions: CustomOptions = {}
  ) {
    super();
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
    };
    this.client = new CuccIotClient(this.options, this.customOptions);
  }

  public async getStatus(mobileNoObj: MobileNoObj): Promise<Status> {
    const res = await this.client.getDetail(mobileNoObj.iccid);
    return statusMap[res.status];
  }

  public async getUsage(mobileNoObj: MobileNoObj): Promise<number> {
    const res = await this.client.getUsage(mobileNoObj.iccid);
    return Math.ceil(res.ctdDataUsage  / 1024); // bytes to KB
  }

  public async activate(mobileNoObj: MobileNoObj): Promise<void> {
    await this.client.setDetail(mobileNoObj.iccid, {
      status: SDKStatus.Activated
    });
  }

  public async deactivate(mobileNoObj: MobileNoObj): Promise<void> {
    await this.client.setDetail(mobileNoObj.iccid, {
      status: SDKStatus.Deactivated
    });
  }

  public async reactivate(mobileNoObj: MobileNoObj): Promise<void> {
    await this.client.setDetail(mobileNoObj.iccid, {
      status: SDKStatus.Activated
    });
  }

  public async getRealNameStatus(mobileNoObj: MobileNoObj): Promise<boolean> {
    const res = await this.client.getRealNameStatus(mobileNoObj.iccid);
    if (res.rspcode === '0001') {
      return true
    } else if (res.rspcode === '0000') {
      return false
    } else {
      throw new Error(`查询实名状态失败！结果码：${res.rspcode}，结果说明：${res.rspdesc}！`);
    }
  }

  public handleEvent(eventParams: EventParams): Promise<EventResponse> {
    return this.client.handleEvent(eventParams);
  }

  static getMobileNoTypeFromEvent(eventParams: EventParams): Promise<MobileNoObj> {
    return CuccIotClient.getMobileNoTypeFromEvent(eventParams);
  }
}

export {
  CuccChannelProtocol as ChannelProtocol,
  config
}
