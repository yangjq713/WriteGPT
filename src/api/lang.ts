import { httpClient, BaseResp, BaseReq } from "./http";

export interface LanguageDetectReq extends BaseReq {
    text: string;
}
export interface LanguageDetectResp extends BaseResp {
    language: number
}

export async function getLanguage(req: LanguageDetectReq): Promise<LanguageDetectResp> {
    // req.login_filter = ;    // 不需要登录
    return await httpClient.post("/lang/detect", req);
    // return await httpClient.get("/edit/history", { params: req });

}