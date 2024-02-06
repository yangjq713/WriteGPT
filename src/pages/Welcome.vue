<script lang="ts" setup>

import { ref, watch, onMounted, onBeforeUnmount } from "vue";
import { GetHistoryMessage, MessageHistoryResp, MessageHistoryReq } from '../api/landing'
import {
  NGrid,
  NGridItem,
  NButton,
  NDropdown,
  NIcon,
  NCard,
  NCarousel,
  useMessage
} from "naive-ui";

import {
  CloudOutline,
  BulbOutline,
  BuildOutline,
  Language,
  PersonOutline,
} from "@vicons/ionicons5";

import { AngleDoubleRight, Asymmetrik } from "@vicons/fa";
import {
  DrawText20Regular,
  CheckboxArrowRight20Regular,
  BoxSearch20Regular,
  BrainCircuit20Regular,
  Home20Filled,
} from "@vicons/fluent";
import {
  AutoGraphFilled,
  AdsClickSharp,
  ArrowRightAltTwotone,
  AccessTimeFilled,
  EmailOutlined,
  NotificationsActiveOutlined
} from "@vicons/material";

import { ResearchBlochSphere } from "@vicons/carbon";
import { getToken, removeToken } from "../utils/auth";
import { useRouter } from "vue-router";

const router = useRouter();
const intervalId = setInterval(getHistoryMessage, 1 * 60 * 1000);
const activeKey = ref<string>("welcome");
// function goToLogin() {
//   router.push("/login");
// }
import { defineComponent } from "vue";
import { useLoadingBar } from "naive-ui";

const LoginedUserOption = ref([
  { label: "个人中心", key: "userCenter" },
  { label: "退出登录", key: "logout" },
]);


const msg = useMessage();
const messageHistoryData = ref({});
function handleUserSelect(key: string | number) {
  if (key === "userCenter") {
    router.push("account");
  } else if (key === "logout") {
    removeToken();
    routeLoginPage();
  }
}

async function getHistoryMessage() {

  // historyShow.value = true
  try {
    const req: MessageHistoryReq = {};
    const res = await GetHistoryMessage(req);
    messageHistoryData.value = res.history_array
  } catch (err) {
    msg.error("加载失败");
  }
}

function routeLoginPage() {
  router.push("login");
}
function routeHomePage() {
  router.push("polish");
}

const loadingBar = useLoadingBar();
const handleLoadingbar = () => {
  loadingBar.start();
  setTimeout(() => {
    loadingBar.finish();
  }, 1000); // 这里模拟加载需要的时间
};
onMounted(() => {
  getHistoryMessage()

});
onBeforeUnmount(() => {
  clearInterval(intervalId);
});
</script>

<template>
  <div class="flex w-full flex-col items-center justify-center bg-gradient-to-b from-sky-100">
    <div class="h-650px w-full">
      <div class="flex items-center justify-between bg-slate-800 px-9 py-3">
        <div class="ml-2 px-3">
          <n-button class="ml-0 mr-3" tag="img" src="../../assets/img/writelearn.jpg" size="large"
            @click="handleLoadingbar" style="cursor: pointer">
          </n-button>
        </div>
        <div class="flex">
          <n-button class="mr-5 text-white" @click="routeHomePage()" quaternary>一键使用</n-button>
          <n-button class="text-white" v-if="!getToken()" @click="routeLoginPage" quaternary>未登录</n-button>
          <n-dropdown trigger="hover" v-else :options="LoginedUserOption" @select="handleUserSelect">
            <n-button class="text-white">
              <template #icon>
                <n-icon class="text-white" size="large">
                  <person-outline />
                </n-icon>
              </template>
            </n-button>
          </n-dropdown>
        </div>
      </div>

      <div class="mt-5 flex flex-col content-center items-center justify-center">
        <div class="w-1200px">
          <n-card title="📖 消息通知" embedded class="mt-10 w-1200px rounded-lg shadow-lg" :segmented="{
            content: true,
            footer: 'soft',
          }" header-style="background-color:#cbd5e1; height:60px;"
            content-style="paddding:0; height:500px; background-color:#dae3f3">
            <n-carousel autoplay draggable show-arrow show-dots>
              <img class="carousel-img" src="../../assets/img/notify_1.png" />
              <img class="carousel-img" src="../../assets/img/notify_2.png" />
              <img class="carousel-img" src="../../assets/img/notify_3.png" />
              <!-- <img class="carousel-img" src="../../assets/img/notify_4.png" /> -->
            </n-carousel>
          </n-card>
        </div>
        <div class="w-1200px">
          <n-carousel style="background-color:#cbd5e1; height:40px;" direction="vertical" dot-placement="right"
            :interval="2000" centered-slides :show-dots="false" autoplay>
            <n-carousel-item v-for="(item, index) in messageHistoryData" :key="index">
              <template #default>
                <div class="flex flex-raw justify-center text-center text-lg font-bold place-items-center h-full">
                  <div class="flex mr-3">
                    <n-icon size="25">
                      <NotificationsActiveOutlined />
                    </n-icon>
                  </div>
                  <div class="flex items-center">
                    <span class="text-blue-600">{{ item.time }}</span>，文修帮助持有邀请码<span
                      class="text-blue-600">{{ item.code }}</span>的尊享用户成功处理了一条<span
                      class="text-blue-600">{{ item.type }}</span>需求。
                  </div>
                </div>
              </template>
            </n-carousel-item>
          </n-carousel>
        </div>

        <div class="mt-2 flex flex-1 content-center justify-center">
          <img src="../../assets/img/slogan.png" class="h-60 content-center justify-center" alt="image" />
        </div>

        <div class="flex-raw mt-10 flex w-1200px">
          <div class="flex w-5/12 flex-col">
            <div class="text-3xl font-bold">科研写作之旅 文修与你同行</div>
            <div class="m-auto mt-20 justify-center text-justify text-xl font-medium leading-8">
              文修由中国科学技术大学认知智能全国重点实验室科研智能服务项目组团队成员面向广大科研写作用户精心打造的一款智能助写在线平台，由团队精调的文修大模型作为算法引擎，
              致力于助力广大师生提升写作效率与增强写作技能。
            </div>
            <div class="mb-0 flex flex-row">
              <div>
                <n-button round size="large" strong type="info" class="m-auto w-28">
                  <router-link :to="{ path: '/polish' }">马上体验 </router-link>
                </n-button>
              </div>
              <div class="ml-5">
                <n-button round size="large" strong type="info" class="w-28">
                  <router-link :to="{ path: '/register' }">一键注册
                  </router-link>
                </n-button>
              </div>
              <div class="ml-5">
                <n-button round size="large" strong type="info" class="w-28">
                  <a href="https://docs.qq.com/form/page/DUmFzek9VV2V2UkpF" target="_blank">join us</a>
                </n-button>
              </div>
            </div>
          </div>
          <div class="relative ml-32 w-1/2 flex-1 rounded-lg bg-black shadow-xl">
            <video loop controls class="w-586px">
              <source src="../../assets/video/wenxiu_intro.mp4" type="video/mp4" />
              Your browser dose not support the video tag.
            </video>
          </div>
        </div>
      </div>
    </div>

    <div class="w-1200px items-center">
      <div class="mb-4 mt-10 flex h-500px flex-col items-center">
        <div class="mb-8 mt-5 w-586px text-center text-4xl font-bold">
          上线功能
        </div>
        <div class="flex w-full justify-around">
          <div class="flex flex-col items-center">
            <n-button class="mb-6 h-20 w-20 rounded-lg shadow-md shadow-lime-700" color="#84cc16">
              <template #icon>
                <n-icon class="text-white" size="40">
                  <DrawText20Regular />
                </n-icon>
              </template>
            </n-button>

            <div class="h-40 w-56 rounded-xl bg-[#B9E0A5]">
              <div class="mt-2 px-3 py-3 text-center text-3xl font-bold">
                写作润色
              </div>
              <!-- <div class="px-4 py-10 text-lg"> -->
              <span
                class="mt-2 inline-block px-4 text-center align-top text-lg text-slate-700">支持个性化润色模式和润色粒度在线推理服务</span>
              <!-- </div> -->
            </div>
          </div>
          <div class="flex flex-col items-center">
            <n-button class="mb-6 h-20 w-20 rounded-lg shadow-md shadow-amber-300" color="#fcd34d">
              <template #icon>
                <n-icon class="text-white" size="40">
                  <CheckboxArrowRight20Regular />
                </n-icon>
              </template>
            </n-button>
            <div class="h-40 w-56 rounded-xl bg-[#F8F3E7]">
              <div class="mt-2 px-3 py-3 text-center text-3xl font-bold">
                文字批阅
              </div>
              <!-- <div class="px-4 py-10 text-lg"> -->
              <span
                class="mt-2 inline-block px-4 text-center align-top text-lg text-slate-700">提供中英双语理解的纠错和修改建议助写服务</span>
              <!-- </div> -->
            </div>
          </div>
          <div class="flex flex-col items-center">
            <n-button class="mb-6 h-20 w-20 rounded-lg shadow-md shadow-cyan-600" color="#0891b2">
              <template #icon>
                <n-icon class="text-white" size="40">
                  <BoxSearch20Regular />
                </n-icon>
              </template>
            </n-button>
            <div class="h-40 w-56 rounded-xl bg-[#99CCFF]">
              <div class="mt-2 px-3 py-3 text-center text-3xl font-bold">
                智能翻译
              </div>
              <!-- <div class="px-4 py-10 text-lg"> -->
              <span
                class="mt-2 inline-block px-4 text-center align-top text-lg text-slate-700">给予更适用于科研写作领域的中英文翻译能力</span>
              <!-- </div> -->
            </div>
          </div>
        </div>
      </div>

      <div class="mb-10 mt-1 flex items-start justify-between">
        <div class="ml-0 flex flex-row items-start">
          <div class="ml-0">
            <img src="../../assets/img/side.png" class="w-16" alt="image" />
          </div>
          <div class="mt-4">
            <div class="p-0 text-3xl font-bold">写作润色</div>
            <div class="mt-6 w-446px text-lg font-normal text-slate-600">
              输入您的文本并根据需要选择润色模式（简正优化、完善润色、全面重构）和粒度（大、中、小），让文修大模型为您生成清晰流畅的表达，精准润色您的信息。
            </div>
          </div>
        </div>
        <div class="mx-0 w-586px">
          <img src="../../assets/gif/polish.gif" class="h-auto max-w-[100%] shadow-xl"
            style="width: 100%; max-width: 700px" alt="image" />
        </div>
      </div>
      <div class="mb-10 mt-20 flex items-start justify-between">
        <div class="mx-1 w-586px">
          <img src="../../assets/gif/grammar.gif" class="h-auto max-w-[100%] shadow-xl"
            style="width: 100%; max-width: 700px" alt="image" />
        </div>
        <div class="ml-0 flex flex-row items-start">
          <div class="ml-0">
            <img src="../../assets/img/side.png" class="w-16" alt="image" />
          </div>
          <div class="mt-4">
            <div class="p-0 text-3xl font-bold">文字批阅</div>
            <div class="mt-6 w-446px text-lg font-normal text-slate-600">
              输入您的文本，文修大模型为您自动发现中英文拼写错误、常见初级语法错误与不地道表达，如结构错误、时态错误等多种科技写作中可能存在的问题。
            </div>
          </div>
        </div>
      </div>
      <div class="mb-10 mt-20 flex items-start justify-between">
        <div class="ml-0 flex flex-row items-start">
          <div class="ml-0">
            <img src="../../assets/img/side.png" class="w-16" alt="image" />
          </div>
          <div class="mt-4">
            <div class="p-0 text-3xl font-bold">智能翻译</div>
            <div class="mt-6 w-446px text-lg font-normal text-slate-600">
              支持中英文双语互译，文修大模型目前已集成海量科研文献语料，能够有效翻译出传统翻译软件理解匮乏的专业词汇。
            </div>
          </div>
        </div>
        <div class="mx-0 w-586px">
          <img src="../../assets/gif/translate.gif" class="h-auto max-w-[100%] shadow-xl"
            style="width: 100%; max-width: 700px" alt="image" />
        </div>
      </div>

      <div class="mt-20 flex flex-col items-center">
        <div>
          <div class="mb-12 mt-6 text-4xl font-bold">平台亮点</div>
        </div>
        <div class="mb-10 flex flex-row justify-center">
          <div class="mx-10 flex w-1/3 flex-col items-center shadow-2xl">
            <n-button class="mt-10 h-20 w-20 rounded-full bg-[#bfdbfe] shadow-md" color="#fcd34d">
              <template #icon>
                <n-icon size="40" color="#030712">
                  <BulbOutline />
                </n-icon>
              </template>
            </n-button>
            <div class="mt-4 text-2xl font-bold">提升写作效率</div>
            <div class="mb-10 mt-6 w-4/5 text-justify text-base font-normal text-slate-600">
              通过写作润色等功能，文修有望帮助您节省大量的修改时间，并将您的文本意思更规范流畅地表达出来，从而让您有更多的时间专注于写作本身，注重想法的创新性而不是纠结于措辞的美观度。
            </div>
          </div>
          <div class="mx-10 flex w-1/3 flex-col items-center shadow-2xl">
            <n-button class="mt-10 h-20 w-20 rounded-full bg-[#bfdbfe] shadow-md" color="#fcd34d">
              <template #icon>
                <n-icon size="40" color="#030712">
                  <AccessTimeFilled />
                </n-icon>
              </template>
            </n-button>
            <div class="mt-4 text-2xl font-bold">提高写作质量</div>
            <div class="mb-10 mt-6 w-4/5 text-justify text-base font-normal text-slate-600">
              文修大模型具有极强上下文理解能力，在润色时可以更好地考虑文本的整体语境，使修改后的文本更加自然流畅。此外，文字批阅功能支持多种类型错误的纠正，帮助您提高写作质量，并潜在促进您写作能力的提升。
            </div>
          </div>
          <div class="mx-10 flex w-1/3 flex-col items-center shadow-2xl">
            <n-button class="mt-10 h-20 w-20 rounded-full bg-[#bfdbfe] shadow-md" color="#fcd34d">
              <template #icon>
                <n-icon size="40" color="#030712">
                  <Language />
                </n-icon>
              </template>
            </n-button>
            <div class="mt-4 text-2xl font-bold">支持中英文双语能力</div>
            <div class="mb-10 mt-6 w-4/5 text-justify text-base font-normal text-slate-600">
              文修智能助写针对于科研专业领域在百万语料上训练了大模型，相比于通用大模型更精通专业领域词汇。因此在中英文写作与翻译上，有望更好地辅助您写出更高质量的文章。
            </div>
          </div>
        </div>
      </div>
      <div class="mt-10 flex flex-col items-center">
        <div>
          <div class="mb-12 mt-6 text-4xl font-bold">技术特色</div>
        </div>
        <div class="mb-10 flex flex-row justify-center">
          <div class="mx-10 flex w-1/3 flex-col items-center shadow-2xl">
            <n-button class="mt-10 h-20 w-20 rounded-full bg-[#bfdbfe] shadow-md" color="#fcd34d">
              <template #icon>
                <n-icon size="40" color="#030712">
                  <BrainCircuit20Regular />
                </n-icon>
              </template>
            </n-button>
            <div class="mt-4 text-2xl font-bold">全国产化的AI技术生态</div>
            <div class="mb-10 mt-6 w-4/5 text-justify text-base font-normal text-slate-600">
              文修智能助写基于全国产AI技术栈（基于华为昇腾910服务器一体化训练、部署、推理自研大模型），无需担心数据出境隐私安全问题。
            </div>
          </div>
          <div class="mx-10 flex w-1/3 flex-col items-center shadow-2xl">
            <n-button class="mt-10 h-20 w-20 rounded-full bg-[#bfdbfe] shadow-md" color="#fcd34d">
              <template #icon>
                <n-icon size="40" color="#030712">
                  <ResearchBlochSphere />
                </n-icon>
              </template>
            </n-button>
            <div class="mt-4 text-2xl font-bold">定位科研的写作大模型</div>
            <div class="mb-10 mt-6 w-4/5 text-justify text-base font-normal text-slate-600">
              文修大模型针对科研领域需求，基于百万科研领域语料训练，拥有丰富的领域知识，助力用户生成高质量、专业的科技文稿。
            </div>
          </div>
          <div class="mx-10 flex w-1/3 flex-col items-center shadow-2xl">
            <n-button class="mt-10 h-20 w-20 rounded-full bg-[#bfdbfe] shadow-md" color="#fcd34d">
              <template #icon>
                <n-icon size="40" color="#030712">
                  <BuildOutline />
                </n-icon>
              </template>
            </n-button>
            <div class="mt-4 text-2xl font-bold">用户个性化的推理服务</div>
            <div class="mb-10 mt-6 w-4/5 text-justify text-base font-normal text-slate-600">
              文修写作润色支持用户根据个人需求，灵活调整润色的风格、结构和内容，以获得更贴合用户想法的文本。
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="mt-10 flex flex-col items-center justify-center">
      <div class="flex flex-col items-center justify-center">
        <div class="mb-12 mt-6 text-4xl font-bold">关于我们</div>
        <div class="text-center text-lg">
          我们文修研发小组师生成员主要来自于认知智能全国重点实验室。
        </div>
        <div class="w-3/5 text-center text-lg">
          过去一段时间，团队成员攻坚克难，先后解决了多项大模型应用中存在的工程与算法难题，研发了一套面向广大写作用户服务的文修智能助写平台。
        </div>
        <div class="w-1/3 text-center text-lg">
          现面向广大师生用户推介使用，希望文修可以成为大家科研路上的良师益友！
        </div>
      </div>
    </div>
    <div class="w-1200px">
      <div class="mt-20 flex flex-col items-center">
        <div>
          <div class="mb-12 mt-6 text-4xl font-bold">指导老师</div>
        </div>
        <div class="mb-10 flex w-1200px flex-row justify-center">
          <div class="mx-10 flex w-320px flex-col items-center rounded-3xl shadow-2xl">
            <img src="../../assets/img/lq.jpeg" class="mb-4 mt-8 h-52 w-52 content-center justify-center" alt="image"
              style="border-radius: 50%" />

            <div class="mt-4 text-xl font-bold">刘淇</div>
            <div class="flex place-items-center justify-self-center">
              <div class="mt-2 flex-col place-items-center" size="large">
                <n-icon size="30" color="#7dd3fc">
                  <EmailOutlined />
                </n-icon>
              </div>

              <div class="ml-2 w-4/5 items-center justify-center text-center text-base font-normal text-slate-600">
                qiliuql@ustc.edu.cn
              </div>
            </div>

            <div class="flex place-items-center justify-self-center">
              <div class="mt-2 flex-col place-items-center" size="large">
                <n-icon size="26" color="#7dd3fc">
                  <Home20Filled />
                </n-icon>
              </div>

              <a class="el-link el-link--default" href="http://staff.ustc.edu.cn/~qiliuql" target="_blank">
                <span
                  class="el-link--inner ml-2 w-4/5 items-center justify-center text-center text-base font-normal">刘淇的个人主页</span>
              </a>
            </div>

            <div class="mb-10 mt-2 w-4/5 text-center text-base font-normal text-slate-600">
              刘淇，教授，博导，国家优青获得者，阿里巴巴达摩院青橙奖
            </div>
          </div>

          <div class="mx-10 flex w-320px flex-col items-center rounded-3xl shadow-2xl">
            <img src="../../assets/img/ceh.jpeg" class="mb-4 mt-8 h-52 w-52 content-center justify-center" alt="image"
              style="border-radius: 50%" />

            <div class="mt-4 text-xl font-bold">陈恩红</div>
            <div class="flex place-items-center justify-self-center">
              <div class="mt-2 flex-col place-items-center" size="large">
                <n-icon size="30" color="#7dd3fc">
                  <EmailOutlined />
                </n-icon>
              </div>

              <div class="ml-2 w-4/5 items-center justify-center text-center text-base font-normal text-slate-600">
                cheneh@ustc.edu.cn
              </div>
            </div>

            <div class="flex place-items-center justify-self-center">
              <div class="mt-2 flex-col place-items-center" size="large">
                <n-icon size="26" color="#7dd3fc">
                  <Home20Filled />
                </n-icon>
              </div>

              <a class="el-link el-link--default" href="http://staff.ustc.edu.cn/~cheneh" target="_blank">
                <span
                  class="el-link--inner ml-2 w-4/5 items-center justify-center text-center text-base font-normal">陈恩红的个人主页</span>
              </a>
            </div>

            <div class="mb-10 mt-2 w-4/5 text-center text-base font-normal text-slate-600">
              陈恩红，教授，博导，国家杰青获得者，大数据学院执行院长
            </div>
          </div>

          <div class="mx-10 flex w-320px flex-col items-center rounded-3xl shadow-2xl">
            <img src="../../assets/img/cmy.jpg" class="mb-4 mt-8 h-52 w-52 content-center justify-center" alt="image"
              style="border-radius: 50%" />

            <div class="mt-4 text-xl font-bold">程明月</div>
            <div class="flex place-items-center justify-self-center">
              <div class="mt-2 flex-col place-items-center" size="large">
                <n-icon size="30" color="#7dd3fc">
                  <EmailOutlined />
                </n-icon>
              </div>

              <div class="ml-2 w-4/5 items-center justify-center text-center text-base font-normal text-slate-600">
                mycheng@ustc.edu.cn
              </div>
            </div>

            <div class="flex place-items-center justify-self-center">
              <div class="mt-2 flex-col place-items-center" size="large">
                <n-icon size="26" color="#7dd3fc">
                  <Home20Filled />
                </n-icon>
              </div>

              <a class="el-link el-link--default" href="https://mingyue-cheng.github.io/" target="_blank">
                <span
                  class="el-link--inner ml-2 w-4/5 items-center justify-center text-center text-base font-normal">程明月的个人主页</span>
              </a>
            </div>

            <div class="mb-10 mt-2 w-4/5 text-center text-base font-normal text-slate-600">
              程明月，副研究员，硕导
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="w-1200px">
      <div class="mt-20 flex flex-col items-center">
        <div>
          <div class="mb-12 mt-6 text-4xl font-bold">团队骨干</div>
        </div>
        <div class="mb-10 flex w-1200px flex-row justify-center">
          <div class="mx-10 flex w-320px flex-col items-center rounded-3xl shadow-2xl">
            <img src="../../assets/img/yjq.png" class="mb-4 mt-8 h-32 content-center justify-center" alt="image"
              style="border-radius: 50%" />

            <div class="mt-4 text-xl font-bold">杨纪千</div>
            <div class="flex place-items-center justify-self-center">
              <div class="mt-2 flex-col place-items-center" size="large">
                <n-icon size="30" color="#7dd3fc">
                  <EmailOutlined />
                </n-icon>
              </div>

              <div class="ml-2 w-4/5 items-center justify-center text-center text-base font-normal text-slate-600">
                yangjq@mail.ustc.edu.cn
              </div>
            </div>

            <div class="mb-10 mt-2 w-4/5 text-center text-base font-normal text-slate-600">
              talk is cheep, show me your code
            </div>
          </div>

          <div class="mx-10 flex w-320px flex-col items-center rounded-3xl shadow-2xl">
            <img src="../../assets/img/yx.png" class="mb-4 mt-8 h-32 w-32 content-center justify-center" alt="image"
              style="border-radius: 50%" />

            <div class="mt-4 text-xl font-bold">于翔</div>
            <div class="flex place-items-center justify-self-center">
              <div class="mt-2 flex-col place-items-center" size="large">
                <n-icon size="30" color="#7dd3fc">
                  <EmailOutlined />
                </n-icon>
              </div>

              <div class="ml-2 w-4/5 items-center justify-center text-center text-base font-normal text-slate-600">
                yux98@mail.ustc.edu.cn
              </div>
            </div>

            <div class="mb-10 mt-2 w-4/5 text-center text-base font-normal text-slate-600">
              好运将至
            </div>
          </div>

          <div class="mx-10 flex w-320px flex-col items-center rounded-3xl shadow-2xl">
            <img src="../../assets/img/zrj.jpg" class="mb-4 mt-8 h-32 w-32 content-center justify-center" alt="image"
              style="border-radius: 50%" />

            <div class="mt-4 text-xl font-bold">张如娇</div>
            <div class="flex place-items-center justify-self-center">
              <div class="mt-2 flex-col place-items-center" size="large">
                <n-icon size="30" color="#7dd3fc">
                  <EmailOutlined />
                </n-icon>
              </div>

              <div class="ml-2 w-4/5 items-center justify-center text-center text-base font-normal text-slate-600">
                zhangrujiao@mail.ustc.edu.cn
              </div>
            </div>

            <div class="mb-10 mt-2 w-4/5 text-center text-base font-normal text-slate-600">
              直起腰来，我看见蓝色的大海和帆影
            </div>
          </div>
        </div>
        <div class="mb-10 flex w-1200px flex-row justify-center">
          <div class="mx-10 flex w-320px flex-col items-center rounded-3xl shadow-2xl">
            <img src="../../assets/img/lyc.jpg" class="mb-4 mt-8 h-32 content-center justify-center" alt="image"
              style="border-radius: 50%" />

            <div class="mt-4 text-xl font-bold">罗彧淙</div>
            <div class="flex place-items-center justify-self-center">
              <div class="mt-2 flex-col place-items-center" size="large">
                <n-icon size="30" color="#7dd3fc">
                  <EmailOutlined />
                </n-icon>
              </div>

              <div class="ml-2 w-4/5 items-center justify-center text-center text-base font-normal text-slate-600">
                prime666@mail.ustc.edu.cn
              </div>
            </div>

            <div class="mb-10 mt-2 w-4/5 text-center text-base font-normal text-slate-600">
              年华似水，思考成金；心海搏浪，理想铸辉
            </div>
          </div>
          <div class="mx-10 flex w-320px flex-col items-center rounded-3xl shadow-2xl">
            <img src="../../assets/img/qqt.jpg" class="mb-4 mt-8 h-32 content-center justify-center" alt="image"
              style="border-radius: 50%" />

            <div class="mt-4 text-xl font-bold">秦启涛</div>
            <div class="flex place-items-center justify-self-center">
              <div class="mt-2 flex-col place-items-center" size="large">
                <n-icon size="30" color="#7dd3fc">
                  <EmailOutlined />
                </n-icon>
              </div>

              <div class="ml-2 w-4/5 items-center justify-center text-center text-base font-normal text-slate-600">
                qqt@mail.ustc.edu.cn
              </div>
            </div>

            <div class="mb-10 mt-2 w-4/5 text-center text-base font-normal text-slate-600">
              负责后端和数据库设计，希望文修越来越好，永远不出bug
            </div>
          </div>

          <div class="mx-10 flex w-320px flex-col items-center rounded-3xl shadow-2xl">
            <img src="../../assets/img/txy.jpg" class="mb-4 mt-8 h-32 content-center justify-center" alt="image"
              style="border-radius: 50%" />

            <div class="mt-4 text-xl font-bold">陶小玉</div>
            <div class="flex place-items-center justify-self-center">
              <div class="mt-2 flex-col place-items-center" size="large">
                <n-icon size="30" color="#7dd3fc">
                  <EmailOutlined />
                </n-icon>
              </div>

              <div class="ml-2 w-4/5 items-center justify-center text-center text-base font-normal text-slate-600">
                txytiny@mail.ustc.edu.cn
              </div>
            </div>

            <div class="mb-10 mt-2 w-4/5 text-center text-base font-normal text-slate-600">
              他强由他强,清风拂山岗,他横由他横,明月照大江
            </div>
          </div>
        </div>

        <div class="mb-10 flex w-1200px flex-row justify-start">
          <div class="mx-10 flex w-320px flex-col items-center rounded-3xl shadow-2xl">
            <img src="../../assets/img/oyj.jpg" class="mb-4 mt-8 h-32 content-center justify-center" alt="image"
              style="border-radius: 50%" />

            <div class="mt-4 text-xl font-bold">欧阳杰</div>
            <div class="flex place-items-center justify-self-center">
              <div class="mt-2 flex-col place-items-center" size="large">
                <n-icon size="30" color="#7dd3fc">
                  <EmailOutlined />
                </n-icon>
              </div>

              <div class="ml-2 w-4/5 items-center justify-center text-center text-base font-normal text-slate-600">
                ouyang_jie@mail.ustc.edu.cn
              </div>
            </div>

            <div class="mb-10 mt-2 w-4/5 text-center text-base font-normal text-slate-600">
              炼丹时长两年半的篮球练习生
            </div>
          </div>
          <div class="mx-10 flex w-320px flex-col items-center rounded-3xl shadow-2xl">
            <img src="../../assets/img/ysn.jpg" class="mb-4 mt-8 h-32 content-center justify-center" alt="image"
              style="border-radius: 50%" />

            <div class="mt-4 text-xl font-bold">姚舒宁</div>
            <div class="flex place-items-center justify-self-center">
              <div class="mt-2 flex-col place-items-center" size="large">
                <n-icon size="30" color="#7dd3fc">
                  <EmailOutlined />
                </n-icon>
              </div>

              <div class="ml-2 w-4/5 items-center justify-center text-center text-base font-normal text-slate-600">
                shuningyao@mail.ustc.edu.cn
              </div>
            </div>

            <div class="mb-10 mt-2 w-4/5 text-center text-base font-normal text-slate-600">
              森林开始用一分钟向我们展示一万年
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="mb-12 mt-20 flex w-1200px flex-col items-center">
      <n-button class="mt-10 h-20 w-20 rounded-full bg-[#bfdbfe] shadow-md" color="#fcd34d">
        <template #icon>
          <n-icon size="40" color="#030712">
            <Asymmetrik />
          </n-icon>
        </template>
      </n-button>
      <div class="mb-4 mt-10">
        <div class="mb-6 text-2xl font-bold">
          还有什么在阻碍你成就非凡之作？
        </div>
        <div class="text-center text-lg">加入我们,和我们的产品一起变得更好</div>
        <div class="m-auto mb-14 flex flex-row items-center justify-center">
          <div class="mt-6">
            <n-button round size="large" strong type="info" class="m-auto w-28">
              <router-link :to="{ path: '/login' }">一键试用 </router-link>
            </n-button>
            <n-button round size="large" strong type="info" class="ml-5 w-28">
              <a href="https://docs.qq.com/form/page/DUmFzek9VV2V2UkpF" target="_blank">join us</a>
            </n-button>
          </div>
        </div>
      </div>
    </div>
    <div class="mt-6 flex flex-col items-center justify-center">
      <div class="mx-10 flex flex-col items-center justify-center">
        <div class="w-1/3">
          <a href="https://www.ustc.edu.cn/" target="_blank">
            <img src="../../assets/img/lab.png" class="flex h-auto" style="width: 100%; max-width: 700px"
              alt="image" /></a>
        </div>
        <div class="flex w-full items-center justify-center text-slate-400">
          Copyright © 2023 中国科学技术大学
          认知智能全国重点实验室-科研智能服务项目组. All Rights Reserved.
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.router-link-active {
  text-decoration: none;
  color: #fff;
}

a {
  text-decoration: none;
  color: #000;
}

.custom-arrow {
  display: flex;
  position: absolute;
  bottom: 25px;
  right: 10px;
}

a:hover {
  color: #7dd3fc;
}

body {
  margin: 0;
}

.n-card {
  max-width: 1200px;
  background-color: #f8fafc;
}

.carousel-img {
  width: 100%;
  height: 300px;
  object-fit: cover;
}
</style>
