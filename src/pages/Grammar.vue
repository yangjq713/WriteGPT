<script lang="ts" setup>
import { h, ref, computed, onMounted, VNodeChild, watch } from "vue";
import {
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
  NCollapse,
  NCollapseItem,
  NUpload,
  CollapseProps,
} from "naive-ui";
import { PolishReq, getPolish } from "../api/polish";
import { HistoryReq, GetAllHistory, HistoryData } from "../api/history";
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
import { ModelAlt } from "@vicons/carbon";
import { HOST, STATUS_SUCCESS } from "../api/http";
import {
  GrammarReq,
  GrammarResp,
  GrammarData,
  getGrammar,
} from "../api/grammar";
import { diffChars, Change } from "diff";
import { FeedBackReq, updateFeedback } from "../api/history";
import { LanguageDetectReq, getLanguage } from "../api/lang";
import { Book20Regular } from "@vicons/fluent";
import { downloadDocs } from "../utils/download";
import { beforeUpload, processFile } from "../utils/upload";
import {
  doFeedback,
  inputCountRender,
  copyText,
  setFeedBack,
  getPaste,
} from "../utils/common";
import { useEventSource } from "@vueuse/core";
import { StreamingHost_Grammer, StreamingHost_Grammar_Json } from "../api/http";
import { useI18n } from "vue-i18n";

const userStore = useUserStore();
const msg = useMessage();
const { t } = useI18n();

const resList = ref<Array<GrammarData>>([]);
const originText = ref("");
const unchangedText = ref("");
const isLoading = ref(false);
const inputCountLimit = ref(false);
const fixUUID = ref("");
const grammarUUID = ref("");
const showable = ref(false);
const resId = ref(-1);
const isEnglish = ref(false);
const tabValue = ref("Auto");
const isAutoDetec = ref(true);
const language = ref(0);
const correctedText = ref("");
const collapseExpanded = ref(["0"]);
const isGenerating = ref(0);
const isButtonDisabled = ref(false);

async function processPaste() {
  getPaste(originText);
}
function inputCountFunc(props: { value: string }): VNodeChild {
  return inputCountRender(props, language.value, inputCountLimit);
}

const processFileFunc = async ({ file }) => {
  processFile(file, originText);
};

watch(originText, (newVal, oldVal) => {
  if (newVal === "") {
    showable.value = false;
    tabValue.value = "Auto";
    correctedText.value = "";
    fixUUID.value = "";
    grammarUUID.value = "";
    resList.value = [];
  } else if (newVal !== oldVal) {
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

async function getResult() {
  isButtonDisabled.value = true;
  if (originText.value == "") {
    msg.error("请输入内容");
    return;
  }
  try {
    resList.value = [];
    showable.value = false;
    collapseExpanded.value = ["0"];
    isLoading.value = true;
    const req: GrammarReq = {
      text: originText.value,
      language: language.value,
    };
    correctedText.value = "";
    const res = await getGrammar(req);
    fixUUID.value = res.corrected;
    grammarUUID.value = res.detailed;
    isGenerating.value = 1;
    startGrammarEventSource(grammarUUID.value);
    showable.value = true;
    unchangedText.value = originText.value;
  } catch (err) {
    isLoading.value = false;
    msg.error("失败，请重试");
  }
}

const startFixEventSource = async (uuid: string) => {
  try {
    const { eventSource: es, close } = await useEventSource(
      StreamingHost_Grammer + "?req_key=" + uuid
    );
    (es.value as EventSource).addEventListener("message", async (event) => {
      const data = event.data;
      isLoading.value = false;
      var strData = data.startsWith("\n") ? data.slice(1) : data;
      correctedText.value += strData;
    });
    (es.value as EventSource).addEventListener("end", async (event) => {
      resId.value = event.data;
      close();
    });
    (es.value as EventSource).addEventListener("error", async (event) => {
      correctedText.value =
        "润色失败，请重试，如果方便可以向我们提供错误描述，十分抱歉！";
      close();
    });
  } catch (err) {}
};

const startGrammarEventSource = async (uuid: string) => {
  try {
    const { eventSource: es, close } = await useEventSource(
      StreamingHost_Grammar_Json + "?req_key=" + uuid
    );
    (es.value as EventSource).addEventListener("Jsonmessage", async (event) => {
      isButtonDisabled.value = true;
      const data = JSON.parse(event.data);
      resList.value.push(data);
      isLoading.value = false;
    });
    (es.value as EventSource).addEventListener("end", async (event) => {
      isButtonDisabled.value = false;
      resId.value = event.data;
      isGenerating.value = 2;
      close();
    });
    (es.value as EventSource).addEventListener("error", async (event) => {
      const errorData: GrammarData = {
        error:
          "语法检查失败，请重试，如果方便可以向我们提供错误描述，十分抱歉！",
        description: "",
      };
      resList.value = [];
      resList.value.push(errorData);
      close();
    });
  } catch (err) {}
};

function onItemHeaderClick(index: string) {
  // 由于我们并不知道本次点击面板是要折叠还是展开，所以需要搜索看看collapseExpanded里面有没有，有的话就说明要折叠
  if (index === "1" && fixUUID.value !== "" && correctedText.value === "") {
    correctedText.value = "";
    if (fixUUID.value !== "") {
      startFixEventSource(fixUUID.value);
    }
  }
  const findIndex = collapseExpanded.value.findIndex((item) => item == index);
  // 判断是折叠还是展开
  if (findIndex >= 0) {
    collapseExpanded.value.splice(findIndex, 1);
  } else {
    collapseExpanded.value.push(index);
  }
}

function handleClose(idx: number, type: number) {
  if (type == 0) {
    resList.value.splice(idx, 1);
  }
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
      isEnglish.value = false;
      tabValue.value = "Chinese-Auto";
    } else {
      language.value = 0;
      isEnglish.value = true;
      tabValue.value = "English-Auto";
    }
  } catch (err) {
    msg.error("语言检测失效");
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
</script>
<template>
  <div class="flex h-full">
    <div class="grow">
      <div class="rounded-md bg-white px-8 py-2 shadow-md">
        <n-card class="mb-10">
          <n-tabs type="line" :onUpdate:value="changeLanguage">
            <n-tab-pane name="2" :tab="tabValue" value> </n-tab-pane>
            <n-tab-pane name="0" tab="Chinese" value> </n-tab-pane>
            <n-tab-pane name="1" tab="English" value> </n-tab-pane>
          </n-tabs>
          <div class="mt-4 flex h-full gap-4">
            <div class="relative w-2/4 justify-start rounded-md border">
              <n-input
                show-count
                v-model:value="originText"
                type="textarea"
                :placeholder="t('capacity.input')"
                class="h-full w-full border-none font-sans text-base"
                :autosize="{
                  minRows: 15,
                  maxRows: 30,
                }"
                :render-count="inputCountFunc"
                @input="detectLang"
                clearable
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
                  >{{ t("capacity.grammar") }}</n-button
                >
                <n-button type="warning" :disabled="true" round v-else
                  >超出限制</n-button
                >
              </div>
            </div>
            <div class="flex h-auto w-2/4 bg-black">
              <div
                class="box-border flex h-full max-h-[800px] w-full flex-col items-center justify-center overflow-auto whitespace-pre-wrap border border-solid border-slate-300 bg-[#127cc6] p-1 font-sans text-base leading-6"
                v-if="isLoading"
              >
                <div class="flex">
                  <img src="../../assets/gif/loading.gif" class="w-40" />
                </div>
                <div class="flex text-slate-50">
                  {{ t("message.grammar") }}
                </div>
              </div>
              <div class="h-full w-full bg-white" v-if="!isLoading">
                <n-collapse
                  :expanded-names="collapseExpanded"
                  v-show="showable"
                >
                  <n-collapse-item :title="t('grammar.wrong')" name="0">
                    <template #header-extra>
                      <div class="text-sm text-gray-400">
                        {{ t("grammar.error") }}
                      </div>
                    </template>
                    <template v-if="resList.length > 0">
                      <n-card
                        v-for="(item, idx) in resList"
                        :title="item.error"
                        hoverable
                        closable
                        @close="handleClose(idx, 0)"
                        :key="idx"
                        class="shadow-2xl"
                      >
                        <div class="text-sm">{{ item.description }}</div>
                      </n-card>
                    </template>
                    <n-card v-else>
                      <div v-if="!isLoading">
                        <p class="text-sm text-gray-500">仔细检查一下哦</p>
                      </div>
                    </n-card>
                    <template v-if="isGenerating > 0">
                      <n-card v-if="isGenerating === 1">
                        <div class="text-sm">正在生成中</div>
                      </n-card>
                      <n-card v-if="isGenerating === 2">
                        <div class="text-sm">{{ t("grammar.finish") }}</div>
                      </n-card>
                    </template>
                  </n-collapse-item>
                  <n-collapse-item
                    :title="t('grammar.repair')"
                    name="1"
                    @click="onItemHeaderClick('1')"
                    :disabled="isGenerating !== 2"
                  >
                    <template #header-extra>
                      <div class="text-sm text-gray-400">
                        {{ t("grammar.right") }}
                      </div>
                    </template>
                    <template #arrow>
                      <n-button class="ml-1" strong secondary circle>
                        <n-icon @click="onItemHeaderClick('1')" size="20">
                          <ModelAlt />
                        </n-icon>
                      </n-button>
                    </template>
                    <n-card hoverable closable class="shadow-2xl">
                      <div class="mb-10 flex font-sans text-base">
                        {{ correctedText }}
                      </div>
                      <div
                        class="absolute bottom-2 mr-4 mt-2 box-border flex w-full justify-between px-0"
                        v-show="correctedText != ''"
                      >
                        <div>
                          <n-button
                            class=""
                            strong
                            secondary
                            circle
                            @click="copyText(correctedText)"
                          >
                            <template #icon>
                              <n-icon>
                                <document-text />
                              </n-icon>
                            </template>
                          </n-button>
                        </div>
                        <div class="mr-8 flex gap-x-2">
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
                            @click="downloadDocs(originText, correctedText)"
                          >
                            <template #icon>
                              <n-icon>
                                <download />
                              </n-icon>
                            </template>
                          </n-button>
                        </div>
                      </div>
                    </n-card>
                  </n-collapse-item>
                </n-collapse>
              </div>
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
</style>
