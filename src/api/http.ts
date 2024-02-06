import axios from "axios";
import { setToken, getToken } from "../utils/auth";
import { useDialog, createDiscreteApi } from "naive-ui";
import router from "../router/index";

const STATUS_SUCCESS = "success";
const STATUS_ERROR = "error";

const CODE_NOT_LOGIN = 900;

export { CODE_NOT_LOGIN, STATUS_ERROR, STATUS_SUCCESS };

export interface BaseReq {
  access_token?: string;
  login_filter?: boolean; // 部分接口不需要登录判断，这里设置为true
}

export interface BaseResp {
  status: string;
  message: string;
  code: number;
}

function isFormData(body: any): body is FormData {
  return body instanceof FormData;
}

export const HOST = "http://47.97.10.6:8000/api/v2";
// export const HOST = "http://localhost:8001/api/v2"
//export const HOST = "http://223.244.40.8:45637/api/v2"
export const StreamingHost = HOST + "/streaming/multi_infer_streaming";
export const StreamingHost_Grammer = HOST + "/streaming/multi_infer_streaming_revise";
export const StreamingHost_Grammar_Json = HOST + "/streaming/multi_infer_streaming_json"
const httpClient = axios.create({
  baseURL: HOST,
  timeout: 30000,
});
// 请求拦截
httpClient.interceptors.request.use(
  (config) => {
    const token = getToken();
    const baseReq = config.data as BaseReq;
    var empty_token = "";
    if (token == null) {
      config.headers.setAuthorization(empty_token);
      baseReq.access_token = empty_token;
    } else {
      config.headers.setAuthorization(token);
      baseReq.access_token = token;
    }
    config.data = baseReq;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截
httpClient.interceptors.response.use(
  (resp) => {
    const baseResp = resp.data as BaseResp;
    var login_filter;
    if (!isFormData(resp.config.data)) {
      const baseReq = JSON.parse(resp.config.data) as BaseReq;
      login_filter = baseReq.login_filter;
    } else {
      login_filter = false;
    }

    const new_token = resp.headers["authorization"];
    if (new_token && new_token !== "") {
      setToken(new_token);
    }
    if (baseResp.code == CODE_NOT_LOGIN && !login_filter) {
      const { dialog } = createDiscreteApi(["dialog"]);
      dialog.info({
        title: "未登录",
        content: "尚未登录，即可登录体验更多",
        positiveText: "去登录",
        negativeText: "我再看看",
        maskClosable: false,
        onPositiveClick: () => {
          router.push("/login");
        },
      });
    }
    return resp.data;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export { httpClient };
