import { httpClient, BaseResp, BaseReq } from "./http";

export interface MessageReq extends BaseReq {
  mark:number;
}

export interface MessageResp extends BaseResp {
  notice_list: Array<MessageData>;
}

export interface MessageData {
  MID: number;
  content: string;
  create_time: string;
  mark: number;
}

export async function GetAllMessage(req: MessageReq): Promise<MessageResp> {
  return await httpClient.post("/message/get_all_notice", req);
}

export interface MessageNumberReq extends BaseReq {}

export interface MessageNumberResp extends BaseResp {
  length: number;
}

export async function GetMessageNumber(
  req: MessageNumberReq
): Promise<MessageNumberResp> {
  return await httpClient.post("/message/get_unread_num", req);
}

export interface MessageReadReq extends BaseReq {
  MID:number;
}

export interface MessageReadResp extends BaseResp {
  message: string;
}

export async function SetMessageRead(
  req: MessageReadReq
): Promise<MessageReadResp> {
  return await httpClient.post("/message/mark_read", req);
}

