import { httpClient, BaseResp, BaseReq } from "./http";

export interface HistoryReq extends BaseReq {
}

export interface HistoryResp extends BaseResp {
    data: Array<HistoryData>,

}

export interface HistoryData {
    // feed_back: number,
    id: number,
    user_input: string,
    user_id: number,
    llm_response: string,
    timestamp: string,
    prompt_intensity_index: number,
    feed_back: number,
}

export interface FeedBackResp extends BaseResp {
}

export interface FeedBackReq extends BaseReq {
    feedback: number,
    id: string;
}

export async function GetAllHistory(req: HistoryReq): Promise<HistoryResp> {
    return await httpClient.post("/history/all",req);
}
export async function updateFeedback(req: FeedBackReq): Promise<FeedBackResp> {
    return await httpClient.post("/history/feedback", req);
}