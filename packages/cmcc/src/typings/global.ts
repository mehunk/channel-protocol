import { Status } from './common';
import {
  GetStatusChangeHistoryResponse,
  GetCurrentPositionCityCodeResponse,
  GetCurrentPositionWgs84Response,
  GetLastPositionCityCodeResponse,
  GetLastPositionWgs84Response
} from './response';

export interface ChannelProtocol {
  // 查询设备状态
  getStatus (iccid: string): Promise<Status>;

  // 查询设备流量用量
  getUsage (iccid: string): Promise<number>;

  // 激活设备
  activate (iccid: string): Promise<void>;

  // 设备停机
  deactivate (iccid: string): Promise<void>;

  // 重新激活设备
  reactivate (iccid: string): Promise<void>;

  getStatusChangeHistory (iccid: string): Promise<GetStatusChangeHistoryResponse>;

  getCurrentPositionCityCode (iccid: string): Promise<GetCurrentPositionCityCodeResponse>;

  getCurrentPositionWgs84 (iccid: string): Promise<GetCurrentPositionWgs84Response>;

  getLastPositionCityCode (iccid: string): Promise<GetLastPositionCityCodeResponse>;

  getLastPositionWgs84 (iccid: string): Promise<GetLastPositionWgs84Response>;
}
