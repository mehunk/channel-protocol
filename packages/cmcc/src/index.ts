import { strict as assert } from 'assert';
import { Redis } from 'ioredis';
import { RateLimiterRedis } from 'rate-limiter-flexible';
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
  private readonly redis: Redis;
  private readonly client: CmccIotClient;
  private readonly operationRateLimiter: RateLimiterRedis;

  constructor(options: Options & { redis: Redis }, customOptions: CustomOptions = {}) {
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

  public async getStatus(iccid: string): Promise<Status> {
    const res = await this.client.getStatus(MobileNoType.iccid, iccid);
    return statusMap[res.cardStatus];
  }

  public async getUsage(iccid: string): Promise<number> {
    const res = await this.client.getUsage(MobileNoType.iccid, iccid);
    return Math.ceil(+res.dataAmount); // dataAmount 属性可能是小数，目前协议只要整数
  }

  public async activate(iccid: string): Promise<void> {
    // 如果距离上次调用还没有超过 30 分钟，则直接返回错误
    await this.checkOperationRequestRate(iccid);
    await this.client.setStatus(MobileNoType.iccid, iccid, OperationType.Inventory2Activated);
  }

  public async deactivate(iccid: string): Promise<void> {
    // 如果距离上次调用还没有超过 30 分钟，则直接返回错误
    await this.checkOperationRequestRate(iccid);
    await this.client.setStatus(MobileNoType.iccid, iccid, OperationType.Activated2Deactivated);
  }

  public async reactivate(iccid: string): Promise<void> {
    // 如果距离上次调用还没有超过 30 分钟，则直接返回错误
    await this.checkOperationRequestRate(iccid);
    await this.client.setStatus(MobileNoType.iccid, iccid, OperationType.Deactivated2Activated);
  }

  /**
   * 检查操作请求调用频率
   *
   * @param iccid - ICCID
   */
  private async checkOperationRequestRate(iccid: string): Promise<void> {
    try {
      await this.operationRateLimiter.consume(iccid);
    } catch (e) {
      throw new Error('30 分钟之内不允许再次调用改变生命周期接口！');
    }
  }
}

export {
  CmccChannelProtocol as ChannelProtocol,
  config
};
