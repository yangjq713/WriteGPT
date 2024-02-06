<script lang="ts" setup>
import { ref, computed, onMounted, h, shallowRef, watch, Component } from "vue";
import {
  NLayout,
  NLayoutSider,
  NMenu,
  NIcon,
  NSpace,
  NButton,
  NLayoutFooter,
} from "naive-ui";
import {
  NTabs,
  NTabPane,
  NRadioButton,
  NRadioGroup,
  NGrid,
  NGi,
  NSlider,
  NInput,
  NSpin,
  NDrawer,
  NDrawerContent,
  NCard,
  TabsInst,
  NCollapse,
  NCollapseItem,
  NDropdown,
  NPopover,
  NBadge,
} from "naive-ui";
import {
  CashOutline as CashIcon,
  TimerOutline,
  ThumbsUpSharp,
  ThumbsDownSharp,
  DocumentText,
  PersonOutline,
  Language,
  Checkmark,
} from "@vicons/ionicons5";
import {
  TranslateFilled,
  EmailOutlined,
  MessageOutlined,
} from "@vicons/material";

import {
  DrawText20Regular,
  CheckboxArrowRight20Regular,
  BoxSearch20Regular,
} from "@vicons/fluent";
import type { MenuOption, DropdownOption } from "naive-ui";
import { FeedBackReq, updateFeedback } from "../api/history";
import { HOST, STATUS_SUCCESS } from "../api/http";
import { HistoryReq, HistoryData, GetAllHistory } from "../api/history";
import {
  MessageReq,
  GetAllMessage,
  MessageNumberReq,
  GetMessageNumber,
  MessageReadReq,
  SetMessageRead,
} from "../api/message";
import { SendSuggestion } from "../api/user";
import {
  BookOutline as BookIcon,
  PersonOutline as PersonIcon,
  WineOutline as WineIcon,
} from "@vicons/ionicons5";
import { AccessibilityCheckmark20Filled } from "@vicons/fluent"
import Main from "./Main.vue";
import { useRouter, useRoute } from "vue-router";
import { useMessage } from "naive-ui";
import { getToken, removeToken } from "../utils/auth";
import { doFeedback } from "../utils/common";
import { useI18n } from "vue-i18n";
import { getLanguage, setLanguage } from "../utils";

function renderIcon(icon: Component) {
  return () => h(NIcon, null, { default: () => h(icon) });
}

const msg = useMessage();

const routeField = [
  {
    key: "grammar",
    field: "grammar",
    route: "/grammar",
  },
  {
    key: "polish",
    field: "polish",
    route: "/polish",
  },
  // {
  //   key: "eval",  评估功能暂时不需要
  //   field: "eval",
  //   route: "/eval",
  // },
  {
    key: "translate",
    field: "translate",
    route: "/translate",
  },
  {
    key: "account",
    field: "account",
    route: "/account",
  },
  {
    key: "case",
    field: "case",
    route: "/case",
  },
  {
    key: "exercise",
    field: "exercise",
    route: "/exercise",
  },
];

const menuOptions = ref<MenuOption[]>([
  {
    label: "智能润色",
    key: "polish",
    icon: renderIcon(DrawText20Regular),
  },
  {
    label: "批阅纠错",
    key: "grammar",
    icon: renderIcon(CheckboxArrowRight20Regular),
  },
  {
    label: "语言翻译",
    key: "translate",
    icon: renderIcon(AccessibilityCheckmark20Filled),
  },
  //{
  // label: "使用案例",
  // key: "case",
  // icon: renderIcon(BoxSearch20Regular),
  //},
]);

const activeKey = ref<string>("polish");
const router = useRouter();
const route = useRoute();
const historyKeys = [
  { key: "edit", name: "写作润色记录" },
  { key: "grammar", name: "语法检测记录" },
  { key: "translate", name: "智能翻译记录" },
];

watch(activeKey, (val) => {
  const ele = routeField.find((x) => x.key === val);
  if (ele) {
    router.push(ele.route);
  }
});
const collapsed = ref(false);

const props = defineProps({});

const allHistoryData = ref({});
const historyShow = ref(false);
const historyLoading = ref(false);
const allMessageData = ref({});
const markedMessageData = ref({});
const unmarkedMessageData = ref({});
const messageNumber = ref();
const messageShow = ref(false);
const dotShow = ref({});
const emailShow = ref(false);
const adviceText = ref("");

const LoginedUserOption = ref([
  { label: "个人中心", key: "userCenter" },
  { label: "退出登录", key: "logout" },
]);
function handleUserSelect(key: string | number) {
  if (key === "userCenter") {
    routeAccountPage();
  } else if (key === "logout") {
    removeToken();
    routeLoginPage();
  }
}

const { locale } = useI18n();
const { t } = useI18n();
const selectedLang = ref<string>("chs");
const LanguageOptions = ref([
  { label: "中文(简体)", key: "chs", icon: renderIcon(Checkmark) },
  { label: "English", key: "en", icon: () => h("") },
]);
function handleLangSelect(key: string | number, option: DropdownOption) {
  if (key === "chs") {
    option.icon = renderIcon(Checkmark);
    LanguageOptions.value[1].icon = () => h("");
  } else if (key === "en") {
    option.icon = renderIcon(Checkmark);
    LanguageOptions.value[0].icon = () => h("");
  }
  selectedLang.value = key as string;
  setLanguage(key as string);
  locale.value = key as string;
}

function setLangIcon() {
  const lang = getLanguage();
  selectedLang.value = lang || "chs";
  if (selectedLang.value === "en") {
    LanguageOptions.value[0].icon = () => h("");
    LanguageOptions.value[1].icon = renderIcon(Checkmark);
  }
}

function updateMenuLang() {
  menuOptions.value[0].label = t("menu.polish");
  menuOptions.value[1].label = t("menu.grammar");
  menuOptions.value[2].label = t("menu.translate");
  LoginedUserOption.value[0].label = t("menu.user");
  LoginedUserOption.value[1].label = t("menu.logout");
}

watch(
  () => locale.value,
  () => {
    updateMenuLang();
  }
);

function copyText(str: string) {
  navigator.clipboard.writeText(str);
  msg.success("复制成功");
}
function getRoute() {
  const routeName = route.name;
  const ele = routeField.find((x) => x.key === routeName);
  if (ele) {
    activeKey.value = ele.field;
  }
}
async function getHistory() {
  // historyShow.value = true
  historyLoading.value = true;
  try {
    const req: HistoryReq = {};
    const res = await GetAllHistory(req);
    allHistoryData.value = res.data;
    console.log(allHistoryData.value);
    if (res.status != STATUS_SUCCESS) {
      // msg.error("未登录")
      return;
    }
    historyShow.value = true;
  } catch (err) {
    msg.error("加载失败");
  } finally {
    historyLoading.value = false;
  }
}

async function getMessage(mark: number) {
  try {
    getMessageNumber();
    const req: MessageReq = {
      mark,
    };
    const res = await GetAllMessage(req);
    if (mark == 0) {
      unmarkedMessageData.value = res.notice_list;
    } else {
      markedMessageData.value = res.notice_list;
    }

    if (res.status != STATUS_SUCCESS) {
      return;
    }
    messageShow.value = true;
  } catch (err) {
    msg.error("加载失败");
  }
}

async function getMessageNumber() {
  try {
    const req: MessageNumberReq = {};
    const res = await GetMessageNumber(req);
    messageNumber.value = res.length;
    if (res.status != STATUS_SUCCESS) {
      return;
    }
  } catch (err) {
    msg.error("获取未读消息失败");
  }
}

async function setMark(mark: number, MID: number) {
  if (mark == 0) {
    setMessageRead(MID);
  }
  return;
}

async function setMessageRead(MID: number) {
  try {
    const req: MessageReadReq = {
      MID,
    };
    const res = await SetMessageRead(req);
    if (res.status != STATUS_SUCCESS) {
      getMessageNumber();
      return;
    }
  } catch (err) {
    msg.error("置位失败");
  }
}

async function handleClose(mark: number, MID: number) {
  setMark(mark, MID);
  getMessage(0);
}

function handleUpdateValue(tabName: string) {
  switch (tabName) {
    case "已读":
      getMessage(1);

    case "未读":
      getMessage(0);

    default:
      return;
  }
}

function routeAccountPage() {
  if (activeKey.value !== "account") {
    activeKey.value = "account";
  }
}

function routeLoginPage() {
  router.push("login");
}
function returnMain() {
  router.push("welcome");
  //activeKey.value = "welcome";
}
function commitFeedBack() {
  emailShow.value = true;
}

function setFeedBack(feedback: number, item: HistoryData) {
  doFeedback(feedback, item.id);
  item.feed_back = feedback;
}

async function userAdvice() {
  if (adviceText.value == "") {
    msg.error("请输入您的建议");
    return;
  } else {
    emailShow.value = false;
    try {
      const req = {
        content: adviceText.value,
      };
      const res = await SendSuggestion(req);
      if (res.status == STATUS_SUCCESS) {
        msg.success("感谢您的建议，这是我们前进的动力");
        adviceText.value = "";
      } else {
        msg.success("感谢您的宝贵时间");
      }
    } catch (err) {
      msg.error("提交失败，请重试");
    }
  }
}

onMounted(() => {
  getRoute();
  getMessageNumber();
  setLangIcon();
  updateMenuLang();
});
</script>
<template>
  <div class="flex h-[100vh] flex-col">
    <div class="flex items-center justify-between bg-slate-800 px-9 py-3">
      <div class="ml-0 px-3">
        <n-button
          class="ml-0 mr-3"
          tag="img"
          src="../../assets/img/writelearn.jpg"
          size="large"
          @click="returnMain"
        >
        </n-button>
      </div>
      <div class="flex">
        <n-button
          class="text-white"
          v-if="!getToken()"
          @click="routeLoginPage"
          quaternary
          >未登录</n-button
        >
        <n-dropdown
          trigger="hover"
          v-else
          :options="LoginedUserOption"
          @select="handleUserSelect"
        >
          <n-button class="text-white">
            <template #icon>
              <n-icon class="text-white" size="large">
                <person-outline />
              </n-icon>
            </template>
          </n-button>
        </n-dropdown>
        <n-dropdown
          trigger="hover"
          :options="LanguageOptions"
          @select="handleLangSelect"
        >
          <a class="ant-dropdown-link text-white" @click.prevent>
            <Language class="h-7 w-7 ml-5" />
          </a>
        </n-dropdown>
      </div>
    </div>
    <n-layout has-sider class="test h-full">
      <n-layout-sider
        bordered
        collapse-mode="width"
        :collapsed-width="64"
        :width="200"
        :collapsed="collapsed"
        show-trigger
        @collapse="collapsed = true"
        @expand="collapsed = false"
      >
        <n-menu
          v-model:value="activeKey"
          :collapsed="collapsed"
          :collapsed-width="64"
          :collapsed-icon-size="22"
          :options="menuOptions"
        />
      </n-layout-sider>
      <n-layout class="bg-gray-50 p-4">
        <router-view></router-view>
      </n-layout>
      <n-layout-sider
        bordered
        collapse-mode="width"
        :collapsed-width="40"
        :width="60"
        :native-scrollbar="false"
        content-style="padding: 8px;"
      >
        <n-space vertical size="large">
          <div style="height: 15px"></div>
          <n-popover placement="left" trigger="hover">
            <template #trigger>
              <n-button
                class="ml-1"
                strong
                secondary
                circle
                @click="getHistory"
                tag="div"
              >
                <template #icon>
                  <n-icon>
                    <timer-outline />
                  </n-icon>
                </template>
              </n-button>
            </template>
            <span>{{ t("menu.history") }}</span>
          </n-popover>
          <div style="height: 5px"></div>
          <n-popover placement="left" trigger="hover">
            <template #trigger>
              <n-button
                class="ml-1"
                strong
                secondary
                circle
                @click="commitFeedBack"
                tag="div"
              >
                <template #icon>
                  <n-icon>
                    <email-outlined />
                  </n-icon>
                </template>
              </n-button>
            </template>
            <span>{{ t("menu.feedback") }}</span>
          </n-popover>
          <div class="-mb-6 -mt-1 ml-3 w-2">
            <n-badge :value="messageNumber" :max="15" size="small">
              <n-avatar />
            </n-badge>
          </div>
          <n-popover placement="left" trigger="hover">
            <template #trigger>
              <n-button
                class="ml-1"
                strong
                secondary
                circle
                @click="getMessage(0)"
                tag="div"
              >
                <template #icon>
                  <n-icon>
                    <message-outlined />
                  </n-icon>
                </template>
              </n-button>
            </template>
            <span>{{ t("menu.message") }}</span>
          </n-popover>
        </n-space>
      </n-layout-sider>
    </n-layout>
    <n-layout-footer
      bordered
      class="grid grid-flow-row-dense grid-cols-12 grid-rows-1"
    >
      <div class="flex w-full items-center justify-center text-slate-400">
        v1958.1.003
      </div>
      <div
        class="col-span-11 flex w-full items-center justify-center text-slate-400"
      >
        Copyright © 2023 中国科学技术大学
        认知智能全国重点实验室-科研智能服务项目组. All Rights Reserved.
      </div>
    </n-layout-footer>
  </div>

  <n-drawer v-model:show="historyShow" :width="502">
    <n-drawer-content title="历史记录">
      <n-spin :show="historyLoading" class="h-full w-full">
        <n-collapse>
          <n-collapse-item
            v-for="item in historyKeys"
            :key="item.key"
            :title="item.name"
          >
            <n-card
              :title="v.timestamp"
              v-for="v in allHistoryData[item.key]"
              :key="v.id"
              class="mb-4"
            >
              <template #header-extra>
                <n-button
                  type="info"
                  size="tiny"
                  secondary
                  class="mr-2"
                  @click="copyText(v.user_input)"
                >
                  复制原文
                </n-button>
                <n-button
                  type="success"
                  size="tiny"
                  secondary
                  @click="copyText(v.llm_response)"
                >
                  复制结果
                </n-button>
                <n-button
                  class=""
                  strong
                  secondary
                  circle
                  @click="setFeedBack(0, v)"
                >
                  <template #icon>
                    <n-icon color="red" v-if="v.feed_back === 0">
                      <thumbs-up-sharp />
                    </n-icon>
                    <n-icon v-else>
                      <thumbs-up-sharp />
                    </n-icon>
                  </template>
                </n-button>
                <n-button
                  class=""
                  strong
                  secondary
                  circle
                  @click="setFeedBack(1, v)"
                >
                  <template #icon>
                    <n-icon color="red" v-if="v.feed_back === 1">
                      <thumbs-down-sharp />
                    </n-icon>
                    <n-icon v-else>
                      <thumbs-down-sharp />
                    </n-icon>
                  </template>
                </n-button>
              </template>
              <template #footer>
                <span class="line-clamp-3 overflow-hidden text-ellipsis">
                  <span class="font-bold">输入原文: </span> {{ v.user_input }}
                </span>
              </template>
              <template #action>
                <span class="line-clamp-3 overflow-hidden text-ellipsis">
                  <span class="font-bold">处理结果: </span> {{ v.llm_response }}
                </span>
              </template>
            </n-card>
          </n-collapse-item>
        </n-collapse>
      </n-spin>
    </n-drawer-content>
  </n-drawer>

  <n-drawer v-model:show="emailShow" :width="502">
    <n-drawer-content title="用户反馈">
      <n-card class="flex justify-center">
        <n-input
          type="textarea"
          v-model:value="adviceText"
          :autosize="{
            minRows: 4,
            maxRows: 8,
          }"
          placeholder="请输入您的反馈内容"
        />
        <div class="ml-20 grid justify-items-end">
          <n-button
            class="mt-5 px-9"
            type="primary"
            size="small"
            @click="userAdvice"
            >提交</n-button
          >
        </div>
      </n-card>
      <n-card title="联系我们" class="mt-5 flex justify-center">
        <div
          class="col-span-11 flex w-full items-center justify-start text-slate-400"
        >
          如果您有更好的建议或者合作意向可以联系我们
        </div>
        <div
          class="col-span-11 flex w-full items-center justify-start text-slate-400"
        >
          邮箱：wenxiu@icanary.cn
        </div>
      </n-card>
    </n-drawer-content>
  </n-drawer>
  <n-drawer v-model:show="messageShow" :width="502">
    <n-drawer-content title="消息">
      <n-tabs type="line" animated @update:value="handleUpdateValue">
        <n-tab-pane name="未读" tab="未读">
          <n-card class="mb-4" v-show="messageNumber == 0">
            <div class="text-3xl font-semibold">暂无消息</div></n-card
          >
          <n-card
            :title="v.create_time"
            v-for="v in unmarkedMessageData"
            :key="v.MID"
            class="mb-4"
            closable
            @close="handleClose(v.mark, v.MID)"
          >
            <div class="text-lg font-bold">{{ v.content }}</div>
          </n-card></n-tab-pane
        >
        <n-tab-pane name="已读" tab="已读" @click="getMessage(1)">
          <n-card
            :title="v.create_time"
            v-for="v in markedMessageData"
            :key="v.MID"
            class="mb-4"
          >
            <div class="text-lg font-bold">{{ v.content }}</div>
          </n-card>
        </n-tab-pane>
      </n-tabs>
    </n-drawer-content>
  </n-drawer>
</template>
