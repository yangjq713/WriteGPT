import { httpClient, BaseResp, BaseReq } from "./http";

export interface TranslateReq extends BaseReq {
    text: string;
    source_language: number;
}

export interface TranslateResp extends BaseResp {
    uuid:string
}

export async function getTranslate(req: TranslateReq): Promise<TranslateResp> {
    return await httpClient.post("/translate/single_paragraph", req);
}