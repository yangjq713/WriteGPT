<script lang="ts" setup>
import {
  h,
  ref,
  computed,
  onMounted,
  nextTick,
  watch,
  VNodeChild,
  defineComponent,
} from "vue";
import {
  NMenu,
  NPopover,
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
  TabsInst,
  NUpload,
  NTag,
  NModal,
} from "naive-ui";
import type { UploadInst, UploadFileInfo } from "naive-ui";
import { PolishReq, getPolish } from "../api/polish";
import { FeedBackReq, updateFeedback } from "../api/history";
import { HistoryReq, HistoryData, GetAllHistory } from "../api/history";
import { LanguageDetectReq, getLanguage } from "../api/lang";
import { useUserStore } from "../store/user";
import { useMessage } from "naive-ui";
import { useI18n } from "vue-i18n";
import {
  CashOutline as CashIcon,
  TimerOutline,
  ThumbsUpSharp,
  ThumbsDownSharp,
  DocumentText,
  Download,
} from "@vicons/ionicons5";
import { DotMark } from "@vicons/carbon";
import {
  Book20Regular,
  LineHorizontal120Filled,
  Accessibility28Regular,
  CheckboxIndeterminate24Regular,
} from "@vicons/fluent";
import { HOST, STATUS_SUCCESS } from "../api/http";
import { downloadDocs, downloadMd } from "../utils/download";
import { beforeUpload, processFile } from "../utils/upload";
import {
  doFeedback,
  inputCountRender,
  copyText,
  tagWords,
  setFeedBack,
  getPaste,
  countWord,
} from "../utils/common";
import { useEventSource } from "@vueuse/core";
import { StreamingHost } from "../api/http";

const { t, locale } = useI18n();
const userStore = useUserStore();
const msg = useMessage();

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
  placeholder: "等待润色",
  theme: "snow",
};

const modeOption = ref({
  1: "简正优化",
  2: "完善润色",
  3: "全面重构",
});

function updateMode() {
  if (locale.value === "chs") {
    modeOption.value = {
      1: "简正优化",
      2: "完善润色",
      3: "全面重构",
    };
  } else if (locale.value === "en") {
    modeOption.value = {
      1: "Simplify",
      2: "Imporve",
      3: "Restructure",
    };
  }
}

watch(
  () => locale.value,
  () => {
    updateMode();
  }
);

onMounted(() => {
  updateMode();
});

const synOption = { 1: "微", 2: "小", 3: "大" };
const modeVal = ref("1");
const synVal = ref(1);
const originText = ref("");
const resOriginText = ref("");
const resText = ref("");
const resId = ref(0);
const language = ref(1);
const isLoading = ref(false);
const tabValue = ref("Auto");
const isAutoDetec = ref(true);
const inputCountLimit = ref(false);
const isButtonDisabled = ref(false);
const setDownloadModal = ref(false);
const resultTime = ref(0);
const startTime = ref(0);
const isOutput = ref(true);

function inputCountFunc(props: { value: string }): VNodeChild {
  return inputCountRender(props, language.value, inputCountLimit);
}

const processFileFunc = async ({ file }) => {
  isButtonDisabled.value = true;
  processFile(file, originText);
  isButtonDisabled.value = false;
};

async function processPaste() {
  getPaste(originText);
}

async function detectLang(value: string) {
  if (value == "" || !isAutoDetec.value) {
    tabValue.value = "Auto";
    return;
  }
  const getLangReq: LanguageDetectReq = {
    text: value,
  };
  try {
    const res = await getLanguage(getLangReq);
    if (res.language == 1) {
      language.value = 1;
      tabValue.value = "Chinese-Auto";
    } else {
      language.value = 0;
      tabValue.value = "English-Auto";
    }
  } catch (err) {
    msg.error("语言检测失效");
  }
}

watch(originText, (newVal, oldVal) => {
  if (newVal == "") {
    resText.value = "";
    tabValue.value = "Auto";
  } else if (newVal != oldVal) {
    detectLang(newVal);
    inputCountFunc({ value: newVal });
  }
});

watch(isAutoDetec, (val) => {
  if (!val) {
    tabValue.value = "Auto";
  } else {
    detectLang(originText.value);
  }
});

const endPolishEventSource = async () => {
  isOutput.value = false;
  isButtonDisabled.value = false;
};

const startPolishEventSource = async (uuid: string) => {
  try {
    const { eventSource: es, close } = await useEventSource(
      StreamingHost + "?req_key=" + uuid
    );
    isOutput.value = true;
    startTime.value = performance.now();

    (es.value as EventSource).addEventListener("message", async (event) => {
      isButtonDisabled.value = true;
      const data = event.data;

      var strData = data.startsWith("\n") ? data.slice(1) : data;
      if (isOutput.value) {
        resText.value += strData;
      }
      isLoading.value = false;
    });
    (es.value as EventSource).addEventListener("end", async (event) => {
      const currentTime = performance.now();
      resultTime.value = parseFloat(
        ((currentTime - startTime.value) / 1000).toFixed(1)
      );
      isButtonDisabled.value = false;
      resId.value = event.data;
      close();
      resOriginText.value = resText.value;
      var diffRes = "";
      if (language.value === 0) {
        diffRes = tagWords(originText.value, resText.value, 0);
      } else {
        diffRes = tagWords(originText.value, resText.value, 1);
      }
      resText.value = diffRes;
    });
    (es.value as EventSource).addEventListener("error", async (event) => {
      resText.value =
        "润色失败，请重试，如果方便可以向我们提供错误描述，十分抱歉！";
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

  try {
    isLoading.value = true;

    const req: PolishReq = {
      text: originText.value,
      prompt_index: parseInt(modeVal.value),
      prompt_intensity_index: synVal.value,
      input_language: language.value,
    };
    const res = await getPolish(req);
    resText.value = "";
    await startPolishEventSource(res.uuid);
  } catch (err) {
    isLoading.value = false;

    msg.error("失败，请重试");
  }
}

function changeLanguage(val: string | number) {
  if (val == "2") {
    isAutoDetec.value = true;
    detectLang(originText.value);
  } else {
    tabValue.value = "Auto";
    isAutoDetec.value = false;
    language.value = val as number;
  }
}

function onMouseOverResText(e: Event) {
  const target = e.target as HTMLElement;
  if (
    target !== null &&
    target.id.startsWith("span-res-") &&
    target.parentNode !== null
  ) {
    target.parentNode.style.backgroundColor = "rgba(173, 216, 230, 0.5)";
    // e.target.parentNode.style.backgroundColor = 'green';
  }
}

function onMouseLeaveResText(e: Event) {
  const target = e.target as HTMLElement;
  if (
    target !== null &&
    target.id.startsWith("span-res-") &&
    target.parentNode !== null
  ) {
    target.parentNode.style.backgroundColor = "white";
  }
}
</script>
<template>
  <div class="flex h-full">
    <div class="grow">
      <div class="rounded-md bg-white px-8 py-2 shadow-md">
        <n-card class="mb-12">
          <n-tabs type="line" :onUpdate:value="changeLanguage">
            <n-tab-pane name="2" :tab="tabValue" value> </n-tab-pane>
            <n-tab-pane name="1" tab="Chinese" value> </n-tab-pane>
            <n-tab-pane name="0" tab="English" value> </n-tab-pane>
          </n-tabs>
          <n-grid x-gap="2" :cols="2">
            <n-gi class="flex items-center gap-2">
              <span class="font-bold">{{ t("mode.title") }}：</span>
              <n-radio-group
                v-model:value="modeVal"
                name="radiobuttongroup2"
                size="medium"
              >
                <n-radio-button
                  v-for="(v, k) in modeOption"
                  :key="k"
                  :value="k"
                >
                  {{ v }}
                </n-radio-button>
              </n-radio-group>
            </n-gi>
            <n-gi class="flex items-center gap-2">
              <span class="font-bold">{{ t("granularity.title") }}:</span>
              <n-slider
                v-model:value="synVal"
                :step="1"
                :min="1"
                :max="3"
                style="display: inline-block; width: 200px"
              />
            </n-gi>
          </n-grid>
          <div class="mt-4 flex h-full gap-4">
            <div class="relative w-2/4 justify-start rounded-md border">
              <n-input
                show-count
                v-model:value="originText"
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
                  :max="2"
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
                  >{{ t("capacity.polish") }}</n-button
                >
                <n-button type="warning" :disabled="true" round v-else
                  >超出限制</n-button
                >
              </div>
            </div>
            <div class="flex h-auto w-2/4">
              <div
                class="box-border flex h-full w-full flex-col items-center justify-center overflow-auto whitespace-pre-wrap border border-solid border-slate-300 bg-[#127cc6] p-1 font-sans text-base leading-6"
                v-if="isLoading"
                @mouseover="onMouseOverResText"
                @mouseout="onMouseLeaveResText"
              >
                <div class="flex">
                  <img src="../../assets/gif/loading.gif" class="w-40" />
                </div>
                <div class="flex text-slate-50">
                  {{ t("message.polish") }}
                </div>
              </div>
              <div class="h-full w-full" v-if="!isLoading">
                <div
                  class="box-border h-full w-full overflow-auto whitespace-pre-wrap border border-solid border-slate-300 bg-white p-1 font-sans text-base leading-6"
                  v-html="resText"
                  @mouseover="onMouseOverResText"
                  @mouseout="onMouseLeaveResText"
                ></div>
                <div
                  class="flex-raw absolute bottom-16 mb-2 box-border flex w-1/2 flex-1 justify-items-stretch px-2"
                  v-show="resText != ''"
                >
                  <div class="flex flex-1">
                    <n-popover placement="right" trigger="hover">
                      <template #trigger>
                        <n-button
                          circle
                          tag="div"
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

                  <div class="felx-1 mr-8 flex items-center text-blue-600/50">
                    {{ t("capacity.time") }}：{{ resultTime }}s/{{
                      t("capacity.words")
                    }}：{{ countWord(resOriginText, language) }}
                  </div>

                  <div class="mr-6 flex flex-1 justify-end">
                    <n-button
                      class=""
                      strong
                      secondary
                      circle
                      @click="copyText(resOriginText)"
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
                      @click="setDownloadModal = true"
                    >
                      <template #icon>
                        <n-icon>
                          <download />
                        </n-icon>
                      </template>
                    </n-button>
                    <n-modal
                      v-model:show="setDownloadModal"
                      :mask-closable="false"
                      preset="dialog"
                      title="下载格式(请选择导出格式)"
                      size="huge"
                      style="width: 400px; height: 200px"
                    >
                      <div class="grid grid-cols-1">
                        <n-button
                          value="DOC"
                          @click="
                            setDownloadModal = false;
                            downloadDocs(originText, resOriginText);
                          "
                          class="mt-6 flex items-center justify-center rounded-md px-3 text-center text-sm font-semibold uppercase text-gray-900 sm:flex-1"
                        >
                          Word
                        </n-button>
                        <n-button
                          value="MD"
                          @click="
                            setDownloadModal = false;
                            downloadMd(originText, resText);
                          "
                          class="mt-4 flex items-center justify-center rounded-md px-3 text-center text-sm font-semibold uppercase text-gray-900 sm:flex-1"
                          >MarkDown</n-button
                        >
                      </div>
                    </n-modal>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="float-right flex justify-between" v-show="resText != ''">
            <div
              class="col-span-11 mr-10 flex w-full items-center justify-center text-slate-400"
              v-show="resText != ''"
            >
              {{ t("capacity.tip") }}
            </div>
            <div class="ml-2 mt-2 flex">
              <n-icon color="blue" class="mt-2 w-2 flex-1">
                <DotMark />
              </n-icon>
              <p class="mt-2 w-20 flex-1 font-serif text-xs">
                {{ t("capacity.replace") }}
              </p>
            </div>
            <div class="ml-2 mt-2 flex">
              <n-icon color="green" class="mt-2 w-2 flex-1">
                <DotMark />
              </n-icon>
              <p class="mt-2 w-10 flex-1 font-serif text-xs">
                {{ t("capacity.add") }}
              </p>
            </div>
            <div class="ml-2 mt-2 flex">
              <n-icon color="#b91c1c" class="mt-2 w-2 flex-1">
                <line-horizontal120-filled />
              </n-icon>
              <p class="mt-2 w-20 flex-1 font-serif text-xs">
                {{ t("capacity.change") }}
              </p>
            </div>
          </div>
        </n-card>
      </div>
    </div>
  </div>
</template>

<style>
.n-spin-content {
  height: 100%;
}

.n-input.n-input--textarea .n-input-word-count {
  left: 10px;
}

.n-input__textarea-el {
  height: 92% !important;
  /* margin-bottom: 100px !important; */
  --n-border-hover: none !important;
  --n-border-focus: none !important;
  /* background-color: rebeccapurple !important; */
  outline-color: none !important;
  border: solid 0px !important;
}

.n-input__textarea-el:hover {
  --tw-ring-color: none !important;
  --tw-ring-shadow: none !important;
  box-shadow: none !important;
}
</style>
