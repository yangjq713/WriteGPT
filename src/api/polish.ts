import { httpClient, BaseResp, BaseReq } from "./http";

export interface PolishReq extends BaseReq {
    text: string;
    prompt_index: number;
    prompt_intensity_index: number;
    input_language: number;
}

export interface PolishResp extends BaseResp {
    uuid:string
}

export async function getPolish(req: PolishReq): Promise<PolishResp> {
    return await httpClient.post("/edit/single_paragraph", req);
    // return await httpClient.get("/edit/history", { params: req });
}