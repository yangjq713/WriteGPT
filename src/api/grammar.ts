import { httpClient, BaseResp, BaseReq } from "./http";

export interface GrammarReq extends BaseReq {
    text: string;
    language: number;
}

export interface GrammarResp extends BaseResp {
    detailed: string;
    corrected:string;
}

export interface GrammarData {
    error: string;
    description: string;
}
export interface Replacement {
    value: string
}

export async function getGrammar(req: GrammarReq): Promise<GrammarResp> {
    return await httpClient.post("/grammar/single_paragraph", req);
    // return await httpClient.get("/edit/history", { params: req });
}