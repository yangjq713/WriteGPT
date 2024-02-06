<script lang="ts" setup>
import { ref, computed, onMounted, watch } from "vue";
import {
  NButton,
  NInput,
  NFormItem,
  NForm,
  NTabs,
  NTabPane,
  NCard,
  NImage,
  NInputGroup,
  messageDark,
} from "naive-ui";
import { useUserStore } from "../store/user";
// import { useRouter } from "vue-router";
import { STATUS_SUCCESS } from "../api/http";
import {
  loginPass,
  LoginOtpReq,
  loginOtp,
  sendOtp,
  SendOtpReq,
} from "../api/user";
import { setToken, removeToken } from "../utils/auth";
import { useMessage, createDiscreteApi } from "naive-ui";
import router from "../router/index";

const { message } = createDiscreteApi(["message"]);
// const router = useRouter();
// console.log(router);
const userStore = useUserStore();
const userName = ref("");
const pwd = ref("");
const phoneNumber = ref("");
const code = ref("");
const isLoading = ref(false);
const errorMessage = ref("");
const sendCodeDisable = ref(false);
const timer = ref(0);
var phoneNumberFeedBack = ref("");

let timeInterval = 0;

async function login() {
  if (userName.value.length === 0 || pwd.value.length === 0) {
    errorMessage.value = "请输入完整信息";
    return;
  }
  isLoading.value = true;
  errorMessage.value = "";
  const params = {
    user_name: userName.value,
    password: pwd.value,
  };

  try {
    const res = await userStore.login(params);
    if (res.status != STATUS_SUCCESS) {
      errorMessage.value = res.message;
      return;
    }
    router.push("/polish");
  } catch (err) {
    errorMessage.value = "登录失败";
    console.error(err);
  } finally {
    isLoading.value = false;
  }
}

async function doLoginOtp() {
  errorMessage.value = "";
  if (phoneNumber.value == "" || code.value == "") {
    errorMessage.value = "请输入完整信息";
    return;
  } else if (!validateNo(phoneNumber.value)) {
    errorMessage.value = "请输入正确的联系方式";
    return;
  }
  isLoading.value = true;
  const params: LoginOtpReq = {
    authentication: phoneNumber.value,
    otp: code.value,
    sign: PHONE_NO.test(phoneNumber.value) ? 0 : 1, // 手机号0，邮箱1
  };
  try {
    const res = await loginOtp(params);
    if (res.status != STATUS_SUCCESS) {
      errorMessage.value = res.message;
      return;
    }
    setToken(res.access_token);
    router.push("/polish");
  } catch (err) {
    errorMessage.value = "登录失败";
  } finally {
    isLoading.value = false;
  }
}

// 游客模式
function tourist() {
  removeToken();
  router.push("/polish");
}

// 注册
function register() {
  router.push("/register");
}

// 等待验证码
function waitSendCode() {
  if (timer.value !== 0) {
    return;
  }

  sendCodeDisable.value = true;
  timer.value = 60;
  timeInterval = setInterval(() => {
    if (timer.value <= 0) {
      sendCodeDisable.value = false;
      clearInterval(timeInterval);
      timeInterval = 0;
      return;
    } else {
      // 单次定时任务执行的回调
      timer.value--;
    }
  }, 1000);
}

async function sendCode() {
  waitSendCode();
  const params: SendOtpReq = {
    authentication: phoneNumber.value,
    sign: PHONE_NO.test(phoneNumber.value) ? 0 : 1, // 手机号0，邮箱1
  };
  try {
    const res = await sendOtp(params);
    if (res.status != STATUS_SUCCESS) {
      errorMessage.value = res.message;
      return;
    } else {
      message.info("发送成功");
    }
  } catch (err) {
    errorMessage.value = "发送失败";
  } finally {
  }
}
const PHONE_NO =
  /^(0|86|17951)?(13[0-9]|15[012356789]|16[67]|17[1235678]|18[0-9]|19[01356789]|14[0578])[0-9]{8}$/;
const EMAIL_NO = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,4}$/;
function validateNo(n: string): boolean {
  return PHONE_NO.test(n) || EMAIL_NO.test(n);
}
function checkPhoneNumber() {
  if (!validateNo(phoneNumber.value)) {
    phoneNumberFeedBack.value = "输入联系方式不正确";
    return false;
  }
  phoneNumberFeedBack.value = "";
  return true;
}
</script>
<template>
  <div class="relative h-screen">
    <div
      class="absolute inset-x-0 top-1/4 m-auto h-1/5 w-1/4 min-w-[500px] xl:w-1/6"
    >
      <div class="mb-7 text-center">
        <n-image
          src="../../assets/img/wenXiu_Logo.jpg"
          width="200"
          preview-disabled
        />
      </div>
      <n-card>
        <n-tabs
          class="card-tabs"
          default-value="0"
          size="large"
          animated
          pane-wrapper-style="padding: 0 -4px"
          pane-style="padding-left: 0 4px; padding-right: 0 4px; box-sizing: border-box;"
        >
          <n-tab-pane name="0" tab="密码登录">
            <n-form
              class="relative space-y-3 rounded-md border px-12 pb-20 pt-8"
            >
              <n-form-item label="用户名">
                <n-input
                  v-model:value="userName"
                  placeholder="请输入登录账号"
                ></n-input>
              </n-form-item>
              <n-form-item label="密码">
                <n-input
                  v-model:value="pwd"
                  type="password"
                  placeholder="请输入密码"
                ></n-input>
              </n-form-item>
              <div class="mt-6 flex flex-col">
                <n-button
                  type="info"
                  class="grow bg-blue-500 text-white"
                  :loading="isLoading"
                  @click="login"
                  >登录</n-button
                >
                <div v-show="errorMessage" class="mt-1 text-xs text-red-400">
                  {{ errorMessage }}
                </div>
              </div>
              <div class="absolute bottom-3 right-12">
                <n-button
                  size="small"
                  type="info"
                  quaternary
                  class="text-blue-600"
                  @click="tourist"
                  >游客模式</n-button
                >
                <n-button
                  size="small"
                  type="info"
                  quaternary
                  class="text-blue-600"
                  @click="register"
                  >注册账号</n-button
                >
              </div>
            </n-form>
          </n-tab-pane>
          <n-tab-pane name="1" tab="验证码登录">
            <n-form
              class="relative space-y-3 rounded-md border px-12 pb-20 pt-8"
            >
              <n-form-item label="邮箱/手机号">
                <n-input
                  v-model:value="phoneNumber"
                  placeholder="请输入邮箱或者手机号"
                  :on-input="checkPhoneNumber"
                ></n-input>
                <template #feedback>
                  {{ phoneNumberFeedBack }}
                </template>
              </n-form-item>
              <n-form-item label="验证码">
                <n-input-group>
                  <n-input
                    v-model:value="code"
                    type="text"
                    placeholder="请输入验证码"
                    :style="{ width: '60%' }"
                  ></n-input>
                  <n-button
                    type="info"
                    class="absolute right-1 top-1/2 w-32 -translate-y-1/2 transform"
                    :disabled="sendCodeDisable"
                    @click="sendCode"
                    >{{
                      sendCodeDisable ? timer + " 秒" : "获取验证码"
                    }}</n-button
                  >
                </n-input-group>
              </n-form-item>
              <div class="mt-6 flex flex-col">
                <n-button
                  type="info"
                  class="grow bg-blue-500 text-white"
                  :loading="isLoading"
                  @click="doLoginOtp"
                  >登录</n-button
                >
                <div v-show="errorMessage" class="mt-1 text-xs text-red-400">
                  {{ errorMessage }}
                </div>
              </div>
              <div class="absolute bottom-3 right-12">
                <n-button
                  size="small"
                  type="info"
                  quaternary
                  class="text-blue-600"
                  @click="tourist"
                  >游客模式</n-button
                >
                <n-button
                  size="small"
                  type="info"
                  quaternary
                  class="text-blue-600"
                  @click="register"
                  >注册账号</n-button
                >
              </div>
            </n-form>
          </n-tab-pane>
        </n-tabs>
      </n-card>
    </div>
  </div>
</template>

<style scoped>
.card-tabs .n-tabs-content {
  padding-left: 4px;
}
</style>
