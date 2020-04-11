import { Status } from './common';

interface StatusChangeHistoryItem {
  oldStatus: Status;
  newStatus: Status;
  time: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface GetStatusChangeHistoryResponse extends Array<StatusChangeHistoryItem>{};

export interface GetCurrentPositionCityCodeResponse {
  cityCode: string;
}

export interface GetCurrentPositionWgs84Response {
  longitude: string;
  latitude: string;
}

export interface GetLastPositionCityCodeResponse {
  time: string;
  cityCode: string;
}

export interface GetLastPositionWgs84Response {
  time: string;
  longitude: string;
  latitude: string;
}
