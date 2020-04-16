import { Status } from './common';
import {
  GetStatusChangeHistoryResponse,
  GetCurrentPositionCityCodeResponse,
  GetCurrentPositionWgs84Response,
  GetLastPositionCityCodeResponse,
  GetLastPositionWgs84Response
} from './response';

export interface MobileNoObj {
  iccid?: string;
  msisdn?: string;
}

export interface ChannelProtocol {
  // 查询设备状态
  getStatus (mobileNoObj: MobileNoObj): Promise<Status>;

  // 查询设备流量用量
  getUsage (mobileNoObj: MobileNoObj): Promise<number>;

  // 激活设备
  activate (mobileNoObj: MobileNoObj): Promise<void>;

  // 设备停机
  deactivate (mobileNoObj: MobileNoObj): Promise<void>;

  // 重新激活设备
  reactivate (mobileNoObj: MobileNoObj): Promise<void>;

  getStatusChangeHistory (mobileNoObj: MobileNoObj): Promise<GetStatusChangeHistoryResponse>;

  getCurrentPositionCityCode (mobileNoObj: MobileNoObj): Promise<GetCurrentPositionCityCodeResponse>;

  getCurrentPositionWgs84 (mobileNoObj: MobileNoObj): Promise<GetCurrentPositionWgs84Response>;

  getLastPositionCityCode (mobileNoObj: MobileNoObj): Promise<GetLastPositionCityCodeResponse>;

  getLastPositionWgs84 (mobileNoObj: MobileNoObj): Promise<GetLastPositionWgs84Response>;
}
