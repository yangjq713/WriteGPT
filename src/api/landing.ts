import { httpClient, BaseResp, BaseReq } from "./http";
export interface MessageHistoryReq extends BaseReq {
}

export interface MessageHistoryData {
  time: string;
  code: string;
  type: string;
}

export interface MessageHistoryResp extends BaseResp {
  history_array: Array<MessageHistoryData>;
}

export async function GetHistoryMessage(req:MessageHistoryReq): Promise<MessageHistoryResp> {
  return await httpClient.post("/mainpage/minuteRequest", req);
}