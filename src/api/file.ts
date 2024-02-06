import { httpClient, BaseResp, BaseReq } from "./http";

export interface FileProcessReq extends BaseReq {
    formdata: FormData;
}

export interface FileProcessResp extends BaseResp {
    text: string;
}

export async function parseFile(req: FileProcessReq): Promise<FileProcessResp> {
    return await httpClient.post("/file/parse", req.formdata, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
    // return await httpClient.get("/edit/history", { params: req });
}