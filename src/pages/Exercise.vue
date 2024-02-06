<script lang="ts" setup>
import { NCard, NTabs, NTabPane, NButton, NInput, NCarousel, NCarouselItem, NUpload, NIcon, NTreeSelect} from "naive-ui"
import { ref,computed, onMounted, VNodeChild, watch} from "vue"
import { useMessage } from 'naive-ui';
import { QuestionData, TypeOptions} from "../api/exercise"
import { LanguageDetectReq, getLanguage } from "../api/lang";
import { downloadDocs } from "../utils/download";
import { beforeUpload, processFile}  from "../utils/upload";
import { doFeedback,inputCountRender,copyText} from "../utils/common";
import { CashOutline as CashIcon, TimerOutline, ThumbsUpSharp, ThumbsDownSharp, DocumentText, Download } from '@vicons/ionicons5';
import { Book20Regular } from "@vicons/fluent";


const questionList = ref<Array<QuestionData>>([])
const curQIndex = ref(0)
const qAnswer = ref('')
const language = ref(0)
const inputCountLimit = ref(false);
const typeOptions = ref<Array<TypeOptions>>([])
function changeTab( val: string | number ){
    
}
const msg = useMessage();
async function getPaste() {
  const pasteText = await navigator.clipboard.readText();
  qAnswer.value = qAnswer.value + pasteText
}

function inputCountFunc ( props: { value: string; } ) : VNodeChild{
  return inputCountRender(props,language.value,inputCountLimit) 
}
watch(qAnswer,(newval:string ,oldval:string) => {
    inputCountFunc({ value: newval })
})
async function detectLang(value: string) {
  const getLangReq: LanguageDetectReq = {
    text: value
  }
  try {
    const res = await getLanguage(getLangReq)
    if (res.language == 1) {
      language.value = 1
    } else {
      language.value = 0
    }
  } catch (err) {

    msg.error("语言检测失效");
  }
  inputCountLimit.value = true;
}

const processFileFunc = async ( {file} ) =>  {
  processFile(file,qAnswer)
}
const computedPlaceholder = computed(() => {
  return questionList.value[curQIndex.value].shortMessage
})
const computedQuestionTitle = computed(() => {
    return questionList.value[curQIndex.value].title
})

onMounted(() => {
    var mock :Array<QuestionData> = [
        {   
            "id":0,
            "title":"小测试",
            "question":"Hello world",
            "shortMessage":"请输入你的答案",
            "createDate": new Date
        },
        {   
            "id":1,
            "title":"小测试",
            "question":"Hello BDAA",
            "shortMessage":"请输入你的答案",
            "createDate": new Date
        },
        {   
            "id":2,
            "title":"小测试",
            "question":"Hello world",
            "shortMessage":"请输入你的答案",
            "createDate": new Date
        }
    ]
    questionList.value = mock
    var optionMock:Array<TypeOptions> = [
        {
            "id":0,
            "label":"写作小测",
            "key":"writing",
            "children": []
        },
        {
            "id":1,
            "label":"写作鉴赏",
            "key":"reading",
            "children": [
                {
                    "id": 10001,
                    "label":"摘要阅读",
                    "key":"summary",
                    "children": [],
                }
            ]
        }
    ]
    typeOptions.value = optionMock
});
function commitAnswer() {

}
const changeQuestion = ((cur:number,last:number) => {
    curQIndex.value = cur
    qAnswer.value = ''
    inputCountLimit.value = false
})
</script>


<template>
  <div class="flex h-full">
        <div class="grow">
            <div class="py-2 px-8 bg-white shadow-md rounded-md">
                <n-card class="mb-10">
                    <n-tabs type="line" :onUpdate:value="changeTab">
                        <n-tab-pane name="0" tab="写作小测" value>
                            <n-tree-select
                                multiple
                                cascade
                                checkable
                                :options = "typeOptions"
                                placeholder = "请选择您感兴趣的主题"
                                class = "mb-10"
                            />
                            <n-carousel 
                                effect="card"
                                prev-slide-style="transform: translateX(-150%) translateZ(-800px)"
                                next-slide-style="transform: translateX(50%) translateZ(-800px)"
                                style="height: 480px"
                                :show-dots="false"
                                :on-update:current-index="changeQuestion"
                            >
                                <n-carousel-item v-for="(item,index) in questionList" :key="item.title" :style="{ width: '60%'}">
                                    <n-card :title="item.title" hoverable class="shadow-2xl" :style="{ height:'480px'}" :segmented="{
                                        content:true,
                                        footer:true,
                                        action:true
                                    }">
                                        <template #header-extra>
                                            答题人数：100
                                        </template>
                                        <template #footer>
                                            {{ item.question }}
                                        </template>
                                        <template #action>
                                            <div class="relative border rounded-md justify-start" v-show="curQIndex === index">
                                                <n-input show-count v-model:value="qAnswer" type="textarea" placeholder="请输入原文"
                                                class="w-full h-full border-none" :autosize="{
                                                    minRows: 12,
                                                    maxRows: 16
                                                }" :render-count="inputCountFunc" @input="detectLang" clearable />
                                                <div class="mr-10 absolute left-1/2 top-1/2 translate-x-[-90%] translate-y-[-50%]">
                                                    <n-button type="primary" class="mr-4 absolute left-1/2 top-1/2 translate-x-[-100%] translate-y-[-50%]" strong
                                                    secondary round @click="getPaste" v-show="qAnswer == ''">
                                                    <template #icon>
                                                        <n-icon>
                                                        <cash-icon />
                                                        </n-icon>
                                                    </template>
                                                    粘贴文本
                                                    </n-button>
                                                    <n-upload
                                                    :custom-request="processFileFunc"
                                                    @before-upload="beforeUpload"
                                                    :show-file-list=false
                                                    >
                                                    <n-button type="primary" class="mr-4 absolute left-1/2 top-1/2 translate-x-[5%] translate-y-[-50%]" strong
                                                        secondary round  v-show="qAnswer == ''">
                                                        <template #icon>
                                                        <n-icon>
                                                            <book20-regular />
                                                        </n-icon>
                                                        </template>
                                                        上传文件
                                                    </n-button>
                                                    </n-upload>
                                                </div>
                                                <div class="flex mt-2 justify-end absolute bottom-2	right-2">
                                                    <n-button type="primary" round @click="commitAnswer" v-if="!inputCountLimit">提交回答</n-button>
                                                    <n-button type="warning" :disabled="true" round v-else>超出限制</n-button>
                                                </div>
                                            </div>
                                        </template>
                                    </n-card>
                                </n-carousel-item>
                            </n-carousel>
                        </n-tab-pane>
                        <n-tab-pane name="1" tab="文本鉴赏" value>
                        </n-tab-pane>
                    </n-tabs>
                </n-card>
            </div>
        </div>
    </div>
</template>

