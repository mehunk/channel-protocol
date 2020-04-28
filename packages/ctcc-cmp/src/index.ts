import {
  CtccCmpIotClient,
  Options as SDKOptions,
  CustomOptions,
  Status as SDKStatus,
  OperationType
} from '@china-carrier-iot-sdk/ctcc-cmp';

import { Status, ChannelProtocol, Options, MobileNoObj } from './typings';
import config from './config';

const statusMap = {
  [SDKStatus.TestReady]: Status.Activated, // 测试期直接映射到已激活
  [SDKStatus.Inventory]: Status.Inventory,
  [SDKStatus.ActivationReady]: Status.ActivationReady,
  [SDKStatus.Deactivated]: Status.Deactivated,
  [SDKStatus.Activated]: Status.Activated,
  [SDKStatus.Purged]: Status.Purged,
  [SDKStatus.NotRealNameDeactivated]: Status.NotRealNameDeactivated // 非实名停机
};

class CtccCmpChannelProtocol implements ChannelProtocol {
  private readonly options: SDKOptions;
  private readonly client: CtccCmpIotClient;

  constructor(
    options: Options,
    private customOptions: CustomOptions = {}
  ) {
    this.options = options;
    this.client = new CtccCmpIotClient(this.options, this.customOptions);
  }

  public async getStatus(mobileNoObj: MobileNoObj): Promise<Status> {
    const res = await this.client.getStatus(mobileNoObj.msisdn);
    if (!res.productInfo || !res.productInfo.length) {
      throw new Error('获取号码状态失败！状态数据格式异常！原始数据：' + JSON.stringify(res));
    }
    return statusMap[res.productInfo[0].productMainStatusCd];
  }

  public async getUsage(mobileNoObj: MobileNoObj): Promise<number> {
    const res = await this.client.getUsage(mobileNoObj.msisdn);
    const usageMb = parseFloat(res.TOTAL_BYTES_CNT);
    if (isNaN(usageMb)) {
      throw new Error('获取流量失败！流量数据格式异常！原始数据：' + JSON.stringify(res));
    }
    return Math.ceil(usageMb * 1024);
  }

  public async activate(mobileNoObj: MobileNoObj): Promise<void> {
    await this.client.setStatus(mobileNoObj.msisdn, OperationType.Deactivated2Activated);
  }

  public async deactivate(mobileNoObj: MobileNoObj): Promise<void> {
    await this.client.setStatus(mobileNoObj.msisdn, OperationType.Activated2Deactivated);
  }

  public async reactivate(mobileNoObj: MobileNoObj): Promise<void> {
    await this.client.setStatus(mobileNoObj.msisdn, OperationType.Deactivated2Activated);
  }

  public getRealNameStatus(mobileNoObj: MobileNoObj): Promise<boolean> {
    return this.client.getRealNameStatus(mobileNoObj.msisdn);
  }
}

export {
  CtccCmpChannelProtocol as ChannelProtocol,
  config
}
