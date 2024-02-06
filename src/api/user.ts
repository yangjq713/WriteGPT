import { httpClient, BaseResp, BaseReq } from "./http";

export interface LoginPassResp extends BaseResp {
  access_token: string;
}

export async function loginPass(data: {
  user_name: string;
  password: string;
}): Promise<LoginPassResp> {
  return await httpClient.post("/user/login_pass", data);
}

export interface LoginOtpReq {
  authentication: string;
  otp: string;
  sign: number;
}

export interface LoginOtpResp extends BaseResp {
  access_token: string;
}

export interface RegisterPassResp extends BaseResp {
  user_id: string;
}

export async function Register(data: {
  user_name: string;
  password: string;
  authentication: string;
  otp: string;
  sign: number;
  invitation_code: string;
}): Promise<LoginPassResp> {
  return await httpClient.post("/user/register", data);
}

export async function loginOtp(req: LoginOtpReq): Promise<LoginOtpResp> {
  return await httpClient.post("/user/login_otp", req);
}

export interface SendOtpReq {
  authentication: string;
  sign: number;
}

export interface SendOtpResp extends BaseResp {}

export async function sendOtp(req: SendOtpReq): Promise<SendOtpResp> {
  return await httpClient.post("/user/send_otp", req);
}

//获得用户信息接口
export interface UserInfoReq extends BaseReq {}

export interface UserInfoResp extends BaseResp {
  user_info: any;
}

export async function getUserInfo(req: UserInfoReq): Promise<UserInfoResp> {
  return await httpClient.post("/user/info", { params: req });
}

//获取邀请码
export interface InvitationCodeReq extends BaseReq {}
export interface InvitationCodeResp extends BaseReq {
  code: any;
}

export async function getInvitationCode(
  req: InvitationCodeReq
): Promise<InvitationCodeResp> {
  return await httpClient.post("/invitation/generateInvitationCode", {
    params: req,
  });
}

//获取剩余token
export interface AllTokenNumReq extends BaseReq {}
export interface AllTokenNumResp extends BaseReq {
  all_token_num: any;
  total_token_num:any;
}

export async function getAllTokenNum(
  req: AllTokenNumReq
): Promise<AllTokenNumResp> {
  return await httpClient.post("/user/cur_token", {
    params: req,
  });
}

//获取用户token数
export interface TokenNumSpecifyReq extends BaseReq {
  prompt_index: number;
  year: number;
  month: number;
}
export interface TokenNumSpecifyResp extends BaseReq {
  month_token: Array<number>;
}

export async function getTokenNumSpecify(
  req: TokenNumSpecifyReq
): Promise<TokenNumSpecifyResp> {
  return await httpClient.post("/user/token_num_specify_day", req);
}

//更新用户所有信息接口
export interface UpdateUserInfoReq extends BaseReq {
  user_name: string;
  phone_number: string;
  email: string;
  gender: number;
  age: number;
  education: string;
}

export interface UpdateUserInfoResp extends BaseResp {
  result: boolean;
}

export async function UpdateUserInfo(
  req: UpdateUserInfoReq
): Promise<UpdateUserInfoResp> {
  return await httpClient.post("/user/reset", req);
}

//更新单个用户信息接口
export interface UpdateUserInfoItemReq extends BaseReq {
  item: string;
  value: string;
}

export interface UpdateUserInfoItemResp extends BaseResp {
  result: boolean;
}

export async function UpdateUserInfoItem(
  req: UpdateUserInfoItemReq
): Promise<UpdateUserInfoItemResp> {
  return await httpClient.post("/user/resetUserInfoItem", req);
}

//更新单个用户信息接口
export interface UpdateUserContactItemReq extends BaseReq {
  item: string;
  value: string;
  otp: string;
}

export interface UpdateUserContactItemResp extends BaseResp {
  result: boolean;
}

export async function updateUserContactItem(
  req: UpdateUserContactItemReq
): Promise<UpdateUserContactItemResp> {
  return await httpClient.post("/user/resetContactItem", req);
}

//发送用户建议接口

export interface SendSuggestionReq extends BaseReq {
  content: string;
}

export interface SendSuggestionResp extends BaseResp {
  result: boolean;
}

export async function SendSuggestion(
  req: SendSuggestionReq
): Promise<SendSuggestionResp> {
  return await httpClient.post("/user/advice", req);
}
