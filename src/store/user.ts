import { defineStore } from "pinia";
import { loginPass, LoginPassResp } from "../api/user";
import { setUserInfo } from "../utils";
import { getToken, setToken } from "../utils/auth";

interface UserInfo {
  access_token: string;
}

export const useUserStore = defineStore("user", {
  state: () => ({
    userInfo: {} as UserInfo,
    access_token: getToken()
  }),
  actions: {
    setUserInfo(info: UserInfo) {
      Object.assign(this.userInfo, info);
    },

    login(params: { user_name: string; password: string }): Promise<LoginPassResp> {
      return new Promise((resolve, reject) => {
        loginPass(params).then((res) => {
          setToken(res.access_token)
          resolve(res)
        }).catch((err) => {
          reject(err)
        })
      })
    },

    async getUserInfo(params: { user_name: string; password: string }): Promise<UserInfo> {
      const result = await loginPass(params);
      if (!result) {
        return {} as UserInfo;
      }
      this.setUserInfo(result);
      setUserInfo(result);
      return result;
    },

    clearUserInfo() {
      this.userInfo = {} as UserInfo;
    },
  },
});
