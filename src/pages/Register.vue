<script lang="ts" setup>
import { ref, computed, onMounted, watch, registerRuntimeCompiler } from "vue";
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
} from "naive-ui";
import { useUserStore } from "../store/user";
import { useRouter } from "vue-router";
import { STATUS_SUCCESS } from "../api/http";
import { sendOtp, SendOtpReq, Register } from "../api/user";
import { useMessage } from "naive-ui";
import router from "../router/index";

// const router = useRouter();

const userStore = useUserStore();

const userName = ref("");
const userValidWay = ref("");
const userPassword = ref("");
const validPassword = ref("");
const otp = ref("");
const pwd = ref("");
const invitationCode = ref("");
const isLoading = ref(false);
const errorMessage = ref("");
const sendCodeDisable = ref(false);
const msg = useMessage();
var phoneNumberFeedBack = ref("");

const PHONE_NO =
  /^(0|86|17951)?(13[0-9]|15[012356789]|16[67]|17[1235678]|18[0-9]|19[01356789]|14[0578])[0-9]{8}$/;
const EMAIL_NO = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,4}$/;
const timer = ref(0);

let timeInterval = 0;

function validateNo(n: string): boolean {
  return PHONE_NO.test(n) || EMAIL_NO.test(n);
}
function validInput() {
  if (
    userPassword.value == "" ||
    validPassword.value == "" ||
    userName.value == "" ||
    userValidWay.value == "" ||
    otp.value == ""
  ) {
    errorMessage.value = "请输入完整信息";
    return false;
  } else if (!validateNo(userValidWay.value)) {
    errorMessage.value = "请输入正确的联系方式";
    return false;
  } else if (userPassword.value != validPassword.value) {
    errorMessage.value = "两次输入密码不一致";
    return false;
  } else if (userPassword.value.length < 8) {
    errorMessage.value = "注意密码长度要大于8位";
    return false;
  }
  return true;
}
async function register() {
  errorMessage.value = "";
  if (validInput() == false) {
    return;
  }

  isLoading.value = true;
  const params = {
    user_name: userName.value,
    password: userPassword.value,
    authentication: userValidWay.value,
    otp: otp.value,
    sign: PHONE_NO.test(userValidWay.value) ? 0 : 1, // 手机号0，邮箱1
    invitation_code: invitationCode.value,
  };
  try {
    const res = await Register(params);
    if (res.status != STATUS_SUCCESS) {
      errorMessage.value = res.message;
      return;
    }
    msg.success("注册成功");
    router.push("/login");
  } catch (err) {
    errorMessage.value = "注册失败，请联系管理员";
    console.error(err);
  } finally {
    isLoading.value = false;
  }
}

// 游客模式
function tourist() {
  router.push("/polish");
}

// 注册
function login() {
  router.push("/login");
}

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
  if (userValidWay.value == "") {
    errorMessage.value = "请输入联系方式";
    return;
  }
  waitSendCode();
  const params: SendOtpReq = {
    authentication: userValidWay.value,
    sign: PHONE_NO.test(userValidWay.value) ? 0 : 1,
  };

  try {
    const res = await sendOtp(params);
    if (res.status != STATUS_SUCCESS) {
      errorMessage.value = res.message;
      return;
    }
  } catch (err) {
    errorMessage.value = "发送失败";
    console.error(err);
  } finally {
  }
}

function checkPhoneNumber() {
  if (!validateNo(userValidWay.value)) {
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
      class="top-1/5 absolute inset-x-0 m-auto mt-20 h-1/5 w-1/4 min-w-[500px] xl:w-1/6"
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
          <n-tab-pane name="0" tab="注册账号">
            <n-form
              class="relative space-y-3 rounded-md border px-12 pb-20 pt-8"
            >
              <n-form-item label="用户名">
                <n-input
                  type="text"
                  v-model:value="userName"
                  placeholder="请输入用户名"
                ></n-input>
              </n-form-item>
              <n-form-item label="密码">
                <n-input
                  type="password"
                  v-model:value="userPassword"
                  placeholder="请输入密码"
                  show-password-on="mousedown"
                />
              </n-form-item>
              <n-form-item label="确认密码">
                <n-input
                  type="password"
                  v-model:value="validPassword"
                  placeholder="请再次输入密码"
                  show-password-on="mousedown"
                />
              </n-form-item>
              <n-form-item label="邮箱/手机号">
                <n-input
                  v-model:value="userValidWay"
                  placeholder="请输入邮箱或者手机号"
                  :on-input="checkPhoneNumber"
                ></n-input>
                <template #feedback>
                  {{ phoneNumberFeedBack }}
                </template>
              </n-form-item>
              <n-form-item label="验证码">
                <n-input
                  v-model:value="otp"
                  type="text"
                  placeholder="请输入验证码"
                  :style="{ width: '60%' }"
                ></n-input>
                <n-button
                  type="info"
                  class="absolute right-1 top-1/2 w-28 -translate-y-1/2 transform"
                  :disabled="sendCodeDisable"
                  @click="sendCode"
                  >{{
                    sendCodeDisable ? timer + " 秒" : "获取验证码"
                  }}</n-button
                >
              </n-form-item>
              <n-form-item label="邀请码 (选填)">
                <n-input
                  type="text"
                  v-model:value="invitationCode"
                  placeholder="请输入邀请码"
                ></n-input>
              </n-form-item>
              <div class="mt-6 flex flex-col">
                <n-button
                  type="info"
                  class="grow bg-blue-500 text-white"
                  :loading="isLoading"
                  @click="register"
                  >注册</n-button
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
                  @click="login"
                  >登陆账号</n-button
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
