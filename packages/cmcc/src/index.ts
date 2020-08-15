import { strict as assert } from 'assert';
import { Redis } from 'ioredis';
import { RateLimiterRedis } from 'rate-limiter-flexible';
import {
  CmccIotClient,
  CustomOptions,
  MobileNoType,
  OperationType,
  Options,
  Status as SDKStatus,
  SetGroupMemberOperationType,
  SetGroupMemberEffectType
} from '@china-carrier-iot-sdk/cmcc';

import {
  ChannelProtocol,
  GetStatusChangeHistoryResponse,
  GetCurrentPositionCityCodeResponse,
  GetCurrentPositionWgs84Response,
  GetLastPositionCityCodeResponse,
  GetLastPositionWgs84Response,
  Status,
  MobileNoObj
} from './typings';
import config from './config';

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
  private readonly redis: Redis;
  private readonly client: CmccIotClient;
  private readonly operationRateLimiter: RateLimiterRedis;

  constructor(options: Options, customOptions: CustomOptions = {}) {
    assert(options.redis, '参数中缺少 redis 实例！')
    this.redis = options.redis;
    this.client = new CmccIotClient(options, customOptions);
    this.operationRateLimiter = new RateLimiterRedis({
      storeClient: this.redis,
      points: 1,
      duration: 30 * 60,
      keyPrefix: 'channel-protocol:cmcc:operation'
    });
  }

  public async getStatus(mobileNoObj: MobileNoObj): Promise<Status> {
    const res = await this.client.getStatus(MobileNoType.iccid, mobileNoObj.iccid);
    return statusMap[res.cardStatus];
  }

  public async getUsage(mobileNoObj: MobileNoObj): Promise<number> {
    const res = await this.client.getUsage(MobileNoType.iccid, mobileNoObj.iccid);
    return Math.ceil(+res.dataAmount); // dataAmount 属性可能是小数，目前协议只要整数
  }

  public async activate(mobileNoObj: MobileNoObj): Promise<void> {
    // 如果距离上次调用还没有超过 30 分钟，则直接返回错误
    // await this.checkOperationRequestRate(mobileNoObj);
    await this.client.setStatus(MobileNoType.iccid, mobileNoObj.iccid, OperationType.Inventory2Activated);
  }

  public async deactivate(mobileNoObj: MobileNoObj): Promise<void> {
    // 如果距离上次调用还没有超过 30 分钟，则直接返回错误
    // await this.checkOperationRequestRate(mobileNoObj);
    await this.client.setStatus(MobileNoType.iccid, mobileNoObj.iccid, OperationType.Activated2Deactivated);
  }

  public async reactivate(mobileNoObj: MobileNoObj): Promise<void> {
    // 如果距离上次调用还没有超过 30 分钟，则直接返回错误
    // await this.checkOperationRequestRate(mobileNoObj);
    await this.client.setStatus(MobileNoType.iccid, mobileNoObj.iccid, OperationType.Deactivated2Activated);
  }

  /**
   * 检查操作请求调用频率
   *
   * @param mobileNoObj - 设备号码对象
   */
  private async checkOperationRequestRate(mobileNoObj: MobileNoObj): Promise<void> {
    try {
      await this.operationRateLimiter.consume(mobileNoObj.iccid);
    } catch (e) {
      throw new Error('30 分钟之内不允许再次调用改变生命周期接口！');
    }
  }

  public async getStatusChangeHistory(mobileNoObj: MobileNoObj): Promise<GetStatusChangeHistoryResponse> {
    const res = await this.client.getStatusChangeHistory(MobileNoType.iccid, mobileNoObj.iccid);
    return res.changeHistoryList.map(item => ({
      time: item.changeDate,
      oldStatus: statusMap[item.descStatus],
      newStatus: statusMap[item.targetStatus]
    }));
  }

  public async getCurrentPositionCityCode(mobileNoObj: MobileNoObj): Promise<GetCurrentPositionCityCodeResponse> {
    const res = await this.client.getCurrentPositionCityCode(MobileNoType.iccid, mobileNoObj.iccid);
    return {
      cityCode: res.cityCode
    };
  }

  public async getCurrentPositionWgs84(mobileNoObj: MobileNoObj): Promise<GetCurrentPositionWgs84Response> {
    const res = await this.client.getCurrentPositionWgs84(MobileNoType.iccid, mobileNoObj.iccid);
    return {
      longitude: res.lon,
      latitude: res.lat
    };
  }

  public async getLastPositionCityCode(mobileNoObj: MobileNoObj): Promise<GetLastPositionCityCodeResponse> {
    const res = await this.client.getLastPositionCityCode(MobileNoType.iccid, mobileNoObj.iccid);
    return {
      time: res.onLineTime,
      cityCode: res.cityCode
    };
  }

  public async getLastPositionWgs84(mobileNoObj: MobileNoObj): Promise<GetLastPositionWgs84Response> {
    const res = await this.client.getLastPositionWgs84(MobileNoType.iccid, mobileNoObj.iccid);
    return {
      time: res.lastTime,
      longitude: res.lastLon,
      latitude: res.lastLat
    };
  }

  public setGroupMember(
    mobileNoObj: MobileNoObj,
    groupId: string,
    operationType: SetGroupMemberOperationType,
    effectType?: SetGroupMemberEffectType
  ): Promise<void> {
    return this.client.setGroupMember(mobileNoObj.msisdn, groupId, operationType, effectType);
  }

  public getImei(mobileNoObj: MobileNoObj): Promise<string> {
    return this.client.getImei(MobileNoType.iccid, mobileNoObj.iccid);
  }
}

export {
  CmccChannelProtocol as ChannelProtocol,
  config,
  SetGroupMemberOperationType,
  SetGroupMemberEffectType
};
