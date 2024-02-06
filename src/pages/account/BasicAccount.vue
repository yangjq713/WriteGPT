<template>
  <div class="flex h-full">
    <div class="grow">
      <div class="rounded-md bg-white px-8 py-2 shadow-md">
        <n-grid cols="1" responsive="screen" class="-mt-4">
          <n-grid-item>
            <n-list>
              <n-list-item>
                <template #suffix></template>
                <n-thing title="昵称">
                  <template #description
                    ><span class="text-gray-400">{{
                      formValue.name
                    }}</span></template
                  >
                </n-thing>
              </n-list-item>
              <n-list-item>
                <n-thing
                  title="来到文修已经
                "
                >
                  <template #description
                    ><span class="text-gray-400"
                      >{{ formValue.time }}天</span
                    ></template
                  >
                </n-thing>
              </n-list-item>
              <n-list-item>
                <template #suffix>
                  <n-button
                    type="primary"
                    text
                    @click="
                      setEmailModal = true;
                      newAuthentication = '';
                      phoneNumberFeedBack = '';
                      code = '';
                      timer = 0;
                    "
                    >设置</n-button
                  >
                </template>
                <n-thing title="邮箱">
                  <template #description
                    ><span class="text-gray-400">{{
                      formValue.email
                    }}</span></template
                  >
                </n-thing>
              </n-list-item>
              <n-list-item>
                <template #suffix>
                  <n-button
                    type="primary"
                    text
                    @click="
                      setPhoneModal = true;
                      newAuthentication = '';
                      phoneNumberFeedBack = '';
                      code = '';
                      timer = 0;
                    "
                    >设置</n-button
                  ></template
                >
                <n-thing title="联系电话">
                  <template #description
                    ><span class="text-gray-400">{{
                      formValue.mobile
                    }}</span></template
                  >
                </n-thing>
              </n-list-item>
              <n-list-item>
                <template #suffix>
                  <n-button
                    type="primary"
                    text
                    @click="
                      setGenderModal = true;
                      newGender = formValue.gender;
                    "
                    >设置</n-button
                  >
                </template>
                <n-thing title="性别">
                  <template #description
                    ><span class="text-gray-400">{{
                      formValue.gender
                    }}</span></template
                  >
                </n-thing>
              </n-list-item>
              <n-list-item>
                <template #suffix>
                  <n-button
                    type="primary"
                    text
                    @click="
                      setAgeModal = true;
                      newAge = formValue.age;
                    "
                    >设置</n-button
                  >
                </template>
                <n-thing title="出生年月">
                  <template #description
                    ><span class="text-gray-400">{{
                      formValue.age
                    }}</span></template
                  >
                </n-thing>
              </n-list-item>
              <n-list-item>
                <template #suffix>
                  <n-button
                    type="primary"
                    text
                    @click="
                      setDegreeModal = true;
                      newDegree = formValue.edu;
                    "
                    >设置</n-button
                  >
                </template>
                <n-thing title="教育">
                  <template #description
                    ><span class="text-gray-400">{{
                      formValue.edu
                    }}</span></template
                  >
                </n-thing>
              </n-list-item>
              <n-list-item>
                <template #suffix>
                  <n-button
                    type="primary"
                    text
                    @click="
                      setSchoolModal = true;
                      newSchool = formValue.school;
                    "
                    >设置</n-button
                  >
                </template>
                <n-thing
                  title="毕业/就读院校
                "
                >
                  <template #description
                    ><span class="text-gray-400">{{
                      formValue.school
                    }}</span></template
                  >
                </n-thing>
              </n-list-item>
            </n-list>
          </n-grid-item>
        </n-grid>

        <n-modal
          v-model:show="setGenderModal"
          :mask-closable="false"
          preset="dialog"
          title="修改性别"
          positive-text="确认修改"
          negative-text="取消"
          @positive-click="formSubmit('gender')"
        >
          <n-radio
            :checked="newGender === '男'"
            value="男"
            @change="newGender = '男'"
          >
            男
          </n-radio>
          <n-radio
            :checked="newGender === '女'"
            value="女"
            @change="newGender = '女'"
          >
            女
          </n-radio>
        </n-modal>
        <n-modal
          v-model:show="setAgeModal"
          :mask-closable="false"
          preset="dialog"
          title="修改年龄"
          positive-text="确认修改"
          negative-text="取消"
          @positive-click="formSubmit('birthdate')"
        >
          <n-date-picker v-model:value="timestamp" type="date" />
        </n-modal>
        <n-modal
          v-model:show="setDegreeModal"
          :mask-closable="false"
          preset="dialog"
          title="修改学历"
          positive-text="确认修改"
          negative-text="取消"
          @positive-click="formSubmit('education')"
        >
          <n-dropdown
            trigger="hover"
            :options="degreeOptions"
            @select="handleSelect"
            size="large"
          >
            <n-button>{{ newDegree }}</n-button>
          </n-dropdown>
        </n-modal>

        <n-modal
          v-model:show="setPhoneModal"
          :mask-closable="false"
          preset="dialog"
          title="修改电话号码"
          positive-text="确认修改"
          negative-text="取消"
          @positive-click="formSubmit('mobile')"
        >
          <n-form class="relative space-y-3 rounded-md border px-12 pb-20 pt-8">
            <n-form-item label="手机号">
              <n-input
                v-model:value="newAuthentication"
                placeholder="请输入手机号"
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
                  :style="{ width: '50%' }"
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
              </n-input-group>
            </n-form-item>
          </n-form>
        </n-modal>

        <n-modal
          v-model:show="setEmailModal"
          :mask-closable="false"
          preset="dialog"
          title="修改邮箱"
          positive-text="确认修改"
          negative-text="取消"
          @positive-click="formSubmit('email')"
        >
          <n-form class="relative space-y-3 rounded-md border px-12 pb-20 pt-8">
            <n-form-item label="邮箱">
              <n-input
                v-model:value="newAuthentication"
                placeholder="请输入邮箱"
                :on-input="checkEmailNumber"
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
                  :style="{ width: '50%' }"
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
              </n-input-group>
            </n-form-item>
          </n-form>
        </n-modal>
        <n-modal
          v-model:show="setSchoolModal"
          :mask-closable="false"
          preset="dialog"
          title="修改学历"
          positive-text="确认修改"
          negative-text="取消"
          @positive-click="formSubmit('graduated_school')"
        >
          <n-cascader
            :options="SchoolCategory"
            v-model:value="newSchool"
            placeholder="选择所在院校"
          />
        </n-modal>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref, onMounted } from "vue";
import {
  useMessage,
  NGridItem,
  NGrid,
  NList,
  NModal,
  NDropdown,
  NButton,
  NInputNumber,
  NRadio,
  NListItem,
  NThing,
  NFormItem,
  NForm,
  NInputGroup,
  NInput,
  NCascader,
  NDatePicker,
} from "naive-ui";
import { getToken } from "../../utils/auth";
import router from "../../router";
import SchoolCategory from "../../category/schoolCategory";

import {
  getUserInfo,
  UserInfoReq,
  UpdateUserInfoItem,
  UpdateUserInfoItemReq,
  updateUserContactItem,
  UpdateUserContactItemReq,
  sendOtp,
  SendOtpReq,
} from "../../api/user";
import { STATUS_SUCCESS } from "../../api/http";

const setGenderModal = ref(false);
const setAgeModal = ref(false);
const setDegreeModal = ref(false);
const setPhoneModal = ref(false);
const setEmailModal = ref(false);
const setSchoolModal = ref(false);
const message = useMessage();
const newAge = ref(0);
const newGender = ref("男");
const newDegree = ref("选择学历");
const newAuthentication = ref("");
// const newEmailModel = ref("");
const newSchool = ref("");
const code = ref("");
const sendCodeDisable = ref(false);
const timer = ref(0);
const timestamp = ref(new Date().getTime());
const formValue = reactive({
  name: "", //用户名
  mobile: "", //电话
  email: "", //邮箱
  gender: "男", //性别
  age: 2000 - 10 - 1, //年龄
  edu: "",
  school: "", //毕业院校
  time: 0, //注册天数
});

const degreeOptions = [
  {
    label: "高中",
    key: "高中",
  },
  {
    label: "专科",
    key: "专科",
  },
  {
    label: "本科",
    key: "本科",
  },
  {
    label: "硕士",
    key: "硕士",
  },
  {
    label: "博士",
    key: "博士",
  },
];

const phoneNumberFeedBack = ref("");
let timeInterval = 0;
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
  //   if (
  //     !PHONE_NO.test(newAuthentication.value) ||
  //     !EMAIL_NO.test(newAuthentication.value)
  //   ) {
  //     message.error("请输入正确的联系方式");
  //     return;
  //   }
  if (!PHONE_NO.test(newAuthentication.value)) {
    if (!EMAIL_NO.test(newAuthentication.value)) {
      message.error("请输入正确的联系方式");
      return;
    }
  }
  waitSendCode();
  const params: SendOtpReq = {
    authentication: newAuthentication.value,
    sign: PHONE_NO.test(newAuthentication.value) ? 0 : 1, // 手机号0，邮箱1
  };
  try {
    const res = await sendOtp(params);
    if (res.status != STATUS_SUCCESS) {
      message.error(res.message);
      return;
    } else {
      message.info("发送成功");
    }
  } catch (err) {
    message.error("发送失败");
  } finally {
  }
}

const PHONE_NO =
  /^(0|86|17951)?(13[0-9]|15[012356789]|16[67]|17[1235678]|18[0-9]|19[01356789]|14[0578])[0-9]{8}$/;
const EMAIL_NO = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,4}$/;
function checkPhoneNumber() {
  if (!PHONE_NO.test(newAuthentication.value)) {
    phoneNumberFeedBack.value = "输入的电话号码不正确";
    return false;
  }
  phoneNumberFeedBack.value = "";
  return true;
}

function checkEmailNumber() {
  if (!EMAIL_NO.test(newAuthentication.value)) {
    phoneNumberFeedBack.value = "输入的邮箱不正确";
    return false;
  }
  phoneNumberFeedBack.value = "";
  return true;
}

async function formSubmit(type: string) {
  var string_value = "";
  if (type === "birthdate") {
    const oldTimestamp = new Date(formValue.age).getTime();
    if (timestamp.value === oldTimestamp) return;
    else {
      const newTimes = new Date(timestamp.value);
      const localTime = newTimes.toLocaleDateString("en-GB", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });
      const day = localTime.slice(0, 2);
      const month = localTime.slice(3, 5);
      const year = localTime.slice(6);

      string_value = `${year}-${month}-${day}`;
    }
  } else if (type === "gender") {
    if (newGender.value === formValue.gender) return;
    else {
      if (newGender.value === "男") string_value = "0";
      else string_value = "1";
    }
  } else if (type === "education") {
    if (newDegree.value === formValue.edu) return;
    else string_value = newDegree.value;
  } else if (type === "email") {
    if (newAuthentication.value === formValue.email) return;
    else string_value = newAuthentication.value;
  } else if (type === "mobile") {
    if (newAuthentication.value === formValue.email) return;
    else string_value = newAuthentication.value;
  } else if (type == "graduated_school") {
    if (newSchool.value == formValue.school) return;
    else string_value = newSchool.value;
  }

  //更新用户信息
  if (type !== "email" && type !== "mobile") {
    try {
      const req: UpdateUserInfoItemReq = {
        item: type,
        value: string_value,
      };

      const res = await UpdateUserInfoItem(req);
      if (res.status === "success") {
        message.success(res.message);

        if (type === "birthdate") formValue.age = string_value;
        if (type === "gender") formValue.gender = newGender.value;
        if (type === "education") formValue.edu = newDegree.value;
        if (type === "graduated_school") formValue.school = newSchool.value;
      } else {
        message.error(res.message);
      }
    } catch (err) {
      message.error("更新用户信息失败，请重试");
    }
  } else {
    try {
      if (type === "mobile") type = "phone_number";
      const req: UpdateUserContactItemReq = {
        item: type,
        value: string_value,
        otp: code.value,
      };
      const res = await updateUserContactItem(req);
      if (res.status === "success") {
        message.success(res.message);
        if (type === "email") formValue.email = newAuthentication.value;
        if (type === "phone_number") {
          formValue.mobile = newAuthentication.value;
        }
      } else {
        message.error(res.message);
      }
    } catch (err) {
      message.error("更新用户信息失败，请重试");
    }
  }
}

function handleSelect(key: string | number) {
  newDegree.value = String(key);
}

async function loadUserInfo() {
  //请求用户信息
  try {
    const req: UserInfoReq = {};
    const res = await getUserInfo(req);

    const usr = res.user_info;
    formValue.name = usr.user_name;
    formValue.mobile = usr.phone_number;
    formValue.email = usr.email;
    if (usr.gender === 0) {
      formValue.gender = "男";
    } else {
      formValue.gender = "女";
    }

    formValue.age = usr.birthdate;
    const dateObject = new Date(usr.birthdate);
    timestamp.value = dateObject.getTime();
    formValue.edu = usr.education;
    formValue.school = usr.graduated_school;
    formValue.time = usr.join_days;
  } catch (err) {
    message.error("失败，请重试");
  }
}

onMounted(() => {
  const token = getToken();
  if (!token) {
    router.push("login");
    return;
  }
  loadUserInfo();
});
</script>
