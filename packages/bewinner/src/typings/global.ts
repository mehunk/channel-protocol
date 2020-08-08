import { Status } from './common';

export interface MobileNoObj {
  iccid?: string;
  msisdn?: string;
}

export interface ChannelProtocol {
  // 查询设备状态
  getStatus (mobileNoObj: MobileNoObj): Promise<Status>;

  // 查询设备流量用量
  getUsage (mobileNoObj: MobileNoObj): Promise<number>;

  // 获取实名状态
  getRealNameStatus (mobileNoObj: MobileNoObj): Promise<boolean>;

  // 激活设备
  activate (mobileNoObj: MobileNoObj): Promise<void>;

  // 设备停机
  deactivate (mobileNoObj: MobileNoObj): Promise<void>;

  // 重新激活设备
  reactivate (mobileNoObj: MobileNoObj): Promise<void>;
}
