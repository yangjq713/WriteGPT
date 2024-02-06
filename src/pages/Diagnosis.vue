<script lang="ts" setup>
import { h, ref, computed, onMounted, watch, VNodeChild } from "vue";
import {
  NPopover,
  NMenu,
  NButton,
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
  NIcon,
  NCard,
  NSpace,
  NCollapse,
  NCollapseItem,
  NDropdown,
  NUpload,
} from "naive-ui";
import { TranslateReq, getTranslate } from "../api/translate";
import type { UploadInst, UploadFileInfo } from "naive-ui";
import { useUserStore } from "../store/user";
import { useMessage } from "naive-ui";
import {
  CashOutline as CashIcon,
  TimerOutline,
  ThumbsUpSharp,
  ThumbsDownSharp,
  DocumentText,
  Download,
} from "@vicons/ionicons5";
import { ExchangeAlt } from "@vicons/fa";
import { KeyboardArrowDownOutlined } from "@vicons/material";
import { LanguageDetectReq, getLanguage } from "../api/lang";
import { parseFile, FileProcessReq, FileProcessResp } from "../api/file";
import { Book20Regular, CheckboxIndeterminate24Regular } from "@vicons/fluent";
import { downloadDocs, downloadMd } from "../utils/download";
import { beforeUpload, processFile } from "../utils/upload";
import {
  doFeedback,
  inputCountRender,
  copyText,
  setFeedBack,
  getPaste,
  countWord,
} from "../utils/common";
import { useEventSource } from "@vueuse/core";
import { StreamingHost } from "../api/http";
import { useI18n } from "vue-i18n";
import * as echarts from "echarts/core";
import {
  TitleComponent,
  TitleComponentOption,
  LegendComponent,
  LegendComponentOption,
  GridComponent,
  GridComponentOption,
} from "echarts/components";
import { RadarChart, RadarSeriesOption } from "echarts/charts";
import { CanvasRenderer } from "echarts/renderers";

echarts.use([
  TitleComponent,
  LegendComponent,
  RadarChart,
  CanvasRenderer,
  GridComponent,
]);

type EChartsOption = echarts.ComposeOption<
  | TitleComponentOption
  | LegendComponentOption
  | RadarSeriesOption
  | GridComponentOption
>;

const userStore = useUserStore();
const msg = useMessage();
const { t } = useI18n();

const menuOptions = [
  {
    label: "Chinese",
    key: "chinese",
  },
  {
    label: "English",
    key: "english",
  },
];

const originOption = {
  debug: "info",
  modules: {
    toolbar: null,
  },
  placeholder: "请输入原文",
  theme: "snow",
};

const processOption = {
  debug: "info",
  modules: {
    toolbar: null,
  },
  placeholder: "等待翻译",
  theme: "snow",
};

const synOption = { 1: "微", 2: "小", 3: "大" };

const activeKey = ref<string>();
const modeVal = ref("1");
const synVal = ref(1);
const originText = ref("");
const resText = ref("");
const sourceLanguage = ref(1);
const targetLanguage = ref(0);
const isLoading = ref(false);
const historyShow = ref(false);
const historyLoading = ref(false);
const originEditor = ref("");
const processEditor = ref("");
const resId = ref(0);
const tabValue = ref("Auto");
const isAutoDetec = ref(true);
const sourceTabValue = ref("2");
const targetTabValue = ref("2");
const inputCountLimit = ref(false);
const isButtonDisabled = ref(false);
const resultTime = ref(0);
const startTime = ref(0);
const isOutput = ref(true);

function inputCountFunc(props: { value: string }): VNodeChild {
  return inputCountRender(props, sourceLanguage.value, inputCountLimit);
}

const processFileFunc = async ({ file }) => {
  processFile(file, originText);
};

async function detectLang(value: string) {
  if (value === "" || !isAutoDetec.value) {
    tabValue.value = "Auto";
    return;
  }
  const getLangReq: LanguageDetectReq = {
    text: value,
  };
  try {
    const res = await getLanguage(getLangReq);

    if (res.language == 1) {
      sourceLanguage.value = 1;
      targetLanguage.value = 0;
      tabValue.value = "Chinese-Auto";
    } else {
      sourceLanguage.value = 0;
      targetLanguage.value = 1;
      tabValue.value = "English-Auto";
    }
  } catch (err) {
    msg.error("语言检测失效");
  }
}

async function processPaste() {
  getPaste(originText);
}

function changeSourceLanguage(val: string | number) {
  if (val == "2") {
    isAutoDetec.value = true;
  } else {
    tabValue.value = "Auto";
    isAutoDetec.value = false;
    sourceLanguage.value = val as number;
  }
  // detectLang(originText.value)
}

function changeTargetLanguage(val: string | number) {
  targetLanguage.value = val as number;
}

function selectLanguage() {
  msg.info("多语言翻译正在内测中，敬请期待！");
}

watch(isAutoDetec, (val) => {
  if (!val) {
    tabValue.value = "Auto";
  } else {
    detectLang(originText.value);
  }
});

// clear originText and resText
watch(originText, (newVal, oldVal) => {
  if (newVal == "") {
    resText.value = "";
    tabValue.value = "Auto";
  } else if (newVal != oldVal) {
    detectLang(newVal);
    inputCountFunc({ value: newVal });
  }
});
function exchangeLanguage() {
  if (originText.value == "" || resText.value == "") {
    msg.info("请输入内容，并执行翻译");
    return;
  }
  // exchange value
  var temp = sourceLanguage.value;
  sourceLanguage.value = targetLanguage.value;
  targetLanguage.value = temp;
  // change menu
  if (sourceLanguage.value == 1) {
    sourceTabValue.value = "1";
    targetTabValue.value = "0";
  } else {
    sourceTabValue.value = "0";
    targetTabValue.value = "1";
  }
  // exchange text content
  var tempText = originText.value;
  originText.value = resText.value;
  resText.value = tempText;
  //close autodetect
  isAutoDetec.value = false;
}
function showHistory() {
  historyShow.value = !historyShow.value;
}

const endPolishEventSource = async () => {
  isOutput.value = false;
};

const startTranslateEventSource = async (uuid: string) => {
  try {
    const { eventSource: es, close } = await useEventSource(
      StreamingHost + "?req_key=" + uuid
    );
    isOutput.value = true;
    startTime.value = performance.now();

    (es.value as EventSource).addEventListener("message", async (event) => {
      isButtonDisabled.value = true;
      const data = event.data;
      isLoading.value = false;
      if (isOutput.value) {
        var strData = data.startsWith("\n") ? data.slice(1) : data;
        resText.value += strData;
      }
    });
    (es.value as EventSource).addEventListener("end", async (event) => {
      const currentTime = performance.now();
      resultTime.value = parseFloat(
        ((currentTime - startTime.value) / 1000).toFixed(1)
      );
      resId.value = event.data;
      isButtonDisabled.value = false;
      close();
    });
    (es.value as EventSource).addEventListener("error", async (event) => {
      resText.value =
        "翻译失败，请重试，如果方便可以向我们提供错误描述，十分抱歉！";
      close();
    });
  } catch (err) {}
};

async function getResult() {
  isButtonDisabled.value = true;
  if (originText.value == "") {
    msg.error("请输入内容");
    return;
  }
  // detectLang(originText.value);
  try {
    isLoading.value = true;

    const req: TranslateReq = {
      text: originText.value,
      source_language: sourceLanguage.value,
    };
    const res = await getTranslate(req);
    const uuid = res.uuid;
    resText.value = "";
    await startTranslateEventSource(uuid);
  } catch (err) {
    isLoading.value = false;

    msg.error("失败，请重试");
  }
}

function initCharts() {
  var chartDom = document.getElementById("container")!;
  var myChart = echarts.init(chartDom);
  var option: EChartsOption;

  option = {
    // title: {
    //   text: "Basic Radar Chart",
    // },
    grid: {
      left: "4%",
      right: "4%",
      bottom: "3%",
      containLabel: true,
    },
    radar: {
      // shape: 'circle',
      axisName: {
        color: "#040404",
      },
      indicator: [
        { name: "Grammar Accuracy", max: 6500 },
        { name: "Fluency", max: 16000 },
        { name: "Content Correctness", max: 16000 },
        { name: "Professionalism", max: 50000 },
        { name: "Readability", max: 52000 },
        { name: "Logic", max: 30000 },
      ],
    },
    series: [
      {
        name: "Budget vs spending",
        type: "radar",
        data: [
          {
            value: [5000, 14000, 8000, 26000, 42000, 21000], 
            name: "Actual Spending",
          },
        ],
      },
    ],
  };

  option && myChart.setOption(option);
}

onMounted(() => {
  initCharts();
});
</script>
<template>
  <div class="flex h-full">
    <div class="grow">
      <div class="rounded-md bg-white px-8 py-2 shadow-md">
        <n-card class="mb-12">
          <!-- <n-space justify="space-evenly">
            <n-tabs
              type="line"
              animated
              v-model:value="sourceTabValue"
              :onUpdate:value="changeSourceLanguage"
            >
              <n-tab-pane :tab="tabValue" name="2" value> </n-tab-pane>
              <n-tab-pane name="1" tab="Chinese" value> </n-tab-pane>
              <n-tab-pane name="0" tab="English" value></n-tab-pane>
            </n-tabs>
            <n-dropdown trigger="hover">
              <n-button
                class="ml-1 mt-1 border-none p-0"
                circle
                @click="selectLanguage"
              >
                <template #icon>
                  <n-icon :size="15">
                    <keyboard-arrow-down-outlined />
                  </n-icon>
                </template>
              </n-button>
            </n-dropdown>
            <n-button
              class=""
              strong
              secondary
              circle
              @click="exchangeLanguage"
            >
              <template #icon>
                <n-icon>
                  <exchange-alt />
                </n-icon>
              </template>
            </n-button>
            <n-tabs
              type="line"
              animated
              v-model:value="targetTabValue"
              :onUpdate:value="changeTargetLanguage"
            >
              <n-tab-pane name="1" tab="Chinese" value> </n-tab-pane>
              <n-tab-pane name="0" tab="English" value></n-tab-pane>
            </n-tabs>
            <n-dropdown trigger="hover">
              <n-button
                class="ml-1 mt-1 border-none p-0"
                circle
                @click="selectLanguage"
              >
                <template #icon>
                  <n-icon :size="15">
                    <keyboard-arrow-down-outlined />
                  </n-icon>
                </template>
              </n-button>
            </n-dropdown>
          </n-space> -->
          <div class="mt-4 flex h-full gap-4">
            <div class="relative w-2/4 justify-start rounded-md border">
              <n-input
                v-model:value="originText"
                show-count
                type="textarea"
                :placeholder="t('capacity.input')"
                @input="detectLang"
                class="h-full w-full border-none font-sans text-base"
                :autosize="{
                  minRows: 15,
                  maxRows: 35,
                }"
                clearable
                :render-count="inputCountFunc"
              />
              <div
                class="absolute left-1/2 top-1/2 mr-10 translate-x-[-90%] translate-y-[-50%]"
              >
                <n-button
                  type="primary"
                  class="absolute left-1/2 top-1/2 mr-4 translate-x-[-100%] translate-y-[-50%]"
                  strong
                  secondary
                  round
                  @click="processPaste"
                  v-show="originText == ''"
                >
                  <template #icon>
                    <n-icon>
                      <cash-icon />
                    </n-icon>
                  </template>
                  {{ t("capacity.paste") }}
                </n-button>
                <n-upload
                  :custom-request="processFileFunc"
                  @before-upload="beforeUpload"
                  :show-file-list="false"
                >
                  <n-button
                    type="primary"
                    class="absolute left-1/2 top-1/2 mr-4 translate-x-[5%] translate-y-[-50%]"
                    strong
                    secondary
                    round
                    v-show="originText == ''"
                  >
                    <template #icon>
                      <n-icon>
                        <book20-regular />
                      </n-icon>
                    </template>
                    {{ t("capacity.upload") }}
                  </n-button>
                </n-upload>
              </div>
              <div class="absolute bottom-2 right-2 mt-2 flex justify-end">
                <n-button
                  type="primary"
                  round
                  @click="getResult"
                  v-if="!inputCountLimit"
                  :disabled="isButtonDisabled"
                  >{{ t("capacity.translate") }}</n-button
                >
                <n-button type="warning" :disabled="true" round v-else
                  >超出限制</n-button
                >
              </div>
            </div>
            <div class="flex h-auto w-2/4 bg-black">
              <div
                class="box-border flex h-full w-full flex-col items-center justify-center overflow-auto whitespace-pre-wrap border border-solid border-slate-300 bg-[#127cc6] p-1 font-sans text-base leading-6"
                v-if="isLoading"
              >
                <div class="flex">
                  <img src="../../assets/gif/loading.gif" class="w-40" />
                </div>
                <div class="flex text-slate-50">
                  {{ t("message.translate") }}
                </div>
              </div>
              <div class="h-full w-full" v-if="!isLoading">
                <div
                  id="container"
                  class="h-[400px] w-full bg-white"
                  style="border: 1px solid rgb(225, 225, 225)"
                ></div>
                <!-- <n-input
                  v-model:value="resText"
                  type="textarea"
                  placeholder=""
                  class="h-full w-full font-sans text-base"
                  :autosize="{
                    minRows: 15,
                    maxRows: 35,
                  }"
                /> -->
                <!-- <div
                  class="flex-raw absolute bottom-10 mb-2 box-border flex w-1/2 flex-1 justify-items-stretch px-2"
                  v-show="resText != ''"
                >
                  <div class="flex flex-1">
                    <n-popover placement="right" trigger="hover">
                      <template #trigger>
                        <n-button
                          circle
                          strong
                          secondary
                          @click="endPolishEventSource"
                          ><template #icon
                            ><n-icon size="25">
                              <CheckboxIndeterminate24Regular /> </n-icon></template></n-button
                      ></template>
                      <span>终止</span>
                    </n-popover>
                  </div>

                  <div class="flex text-blue-600/50 items-center mr-6">
                    {{ t("capacity.time") }}：{{ resultTime }}s/{{
                      t("capacity.words")
                    }}：{{ countWord(resText, targetLanguage) }}
                  </div>
                  <div class="flex flex-1 justify-end mr-6">
                    <n-button
                      class=""
                      strong
                      secondary
                      circle
                      @click="copyText(resText)"
                    >
                      <template #icon>
                        <n-icon>
                          <document-text />
                        </n-icon>
                      </template>
                    </n-button>
                    <n-button
                      class=""
                      strong
                      secondary
                      circle
                      @click="doFeedback(0, resId)"
                    >
                      <template #icon>
                        <n-icon>
                          <thumbs-up-sharp />
                        </n-icon>
                      </template>
                    </n-button>
                    <n-button
                      class=""
                      strong
                      secondary
                      circle
                      @click="doFeedback(1, resId)"
                    >
                      <template #icon>
                        <n-icon>
                          <thumbs-down-sharp />
                        </n-icon>
                      </template>
                    </n-button>
                    <n-button
                      class=""
                      strong
                      secondary
                      circle
                      @click="downloadMd(originText, resText)"
                    >
                      <template #icon>
                        <n-icon>
                          <download />
                        </n-icon>
                      </template>
                    </n-button>
                  </div>
                </div> -->
              </div>
            </div>
          </div>
          <!-- <div
            class="float-right col-span-11 flex w-full text-slate-400"
            v-show="resText != ''"
          >
            该结果由自研文修大模型生成，不代表本平台任何观点
          </div> -->
          <div class="float-right flex justify-between" v-show="resText != ''">
            <div
              class="col-span-11 flex w-full items-center justify-center text-slate-400"
              v-show="resText != ''"
            >
              {{ t("capacity.tip") }}
            </div>
          </div>
        </n-card>
      </div>
    </div>
    <div class="ml-2 flex h-full w-[40px]"></div>
  </div>
</template>

<style>
.n-spin-content {
  height: 100%;
}
</style>
