<template>
  <div class="flex h-full">
    <div class="grow w-3/4">
      <div class="rounded-md bg-white px-8 py-2 shadow-md">
        <n-statistic
          label="余量/总量：如果额度使用耗尽，可以联系管理员(邮箱：wenxiu@icanary.cn)"
          :value="allTokenNum"
        >
          <template #prefix
            ><n-icon> <BarChart /></n-icon>
          </template>
          <template #suffix> / {{ totalTokenNum }} </template>
          <span></span>
        </n-statistic>
        <h1 class="mt-6">单词使用情况：</h1>
        <n-space>
          <n-select
            class="w-32"
            v-model:value="selectedValue"
            :options="selectedOptions"
            clearable
            @update:value="getAllTokenNumSpecify()"
          />
          <n-date-picker
            v-model:value="timestamp"
            type="month"
            placeholder="选择年月"
            @update:value="getAllTokenNumSpecify()"
            clearable
          />
        </n-space>

        <div
          class="mt-10"
          id="chart-container"
          style="width: 100%; height: 300px"
        ></div>
      </div>
    </div>
  </div>
  <div class="mt-14 flex h-full">
    <div
      class="bg-whit flex-raw flex grow justify-items-stretch rounded-md shadow-md"
    >
      <div class="ml-10 flex flex-1 flex-col">
        <div class="mb-5 text-start text-xl font-semibold mt-3">
          <div class="flex">
            <div class="flex-raw mr-2">
              <n-icon color="blue-400" size="30"
                ><AddLocationAltOutlined
              /></n-icon>
            </div>
            <div class="flex-raw">文修邀请码机制介绍：</div>
          </div>
        </div>
        <div>
          邀请人数<span class="text-lg text-red-500">1~5</span
          >人，每邀请1人系统为您分配<span class="text-lg text-red-500">5万</span
          >个单词。
        </div>
        <div class="mb-1 mt-1">
          邀请人数<span class="text-lg text-red-500">6-10</span
          >人，每邀请1人系统为您分配<span class="text-lg text-red-500"
            >10万</span
          >个单词。
        </div>
        <div class="mb-1 mt-1">
          邀请人数<span class="text-lg text-red-500">11-15</span
          >人，每邀请1人系统为您分配<span class="text-lg text-red-500"
            >15万</span
          >个单词。
        </div>
        <div class="mb-3 mt-1">
          邀请人数大于<span class="text-lg text-red-500">15</span
          >人，每邀请1人系统为您分配<span class="text-lg text-red-500">20万</span
          >个单词。
        </div>
      </div>
    </div>
    <div
      class="ml-10 flex grow flex-col rounded-md bg-white text-start shadow-md"
    >
      <div class="ml-10">
        <div class="flex place-items-center">
          <div class="flex-raw mr-2 mt-3 place-items-center">
            <n-icon size="30"><LinkOutline /></n-icon>
          </div>
          <div class="flex-raw text-xl font-semibold">专属邀请码</div>
        </div>
        <h3>{{ invitationCode }}</h3>
        <n-button
          class="mb-3 w-20"
          strong
          secondary
          @click="copyText(invitationCode)"
          >复制</n-button
        >
        <div class="mb-3 text-lg font-semibold text-blue-400">
          分享，让更多人享受轻松写作
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";
import { copyText } from "../../utils/common";
import {
  useMessage,
  NButton,
  NDatePicker,
  NSpace,
  NSelect,
  NStatistic,
  NIcon,
} from "naive-ui";
import {
  getInvitationCode,
  InvitationCodeReq,
  getAllTokenNum,
  AllTokenNumReq,
  TokenNumSpecifyReq,
  getTokenNumSpecify,
} from "../../api/user";
import { getToken } from "../../utils/auth";
import { STATUS_SUCCESS } from "../../api/http";
import router from "../../router";
import * as echarts from "echarts";
import { BarChart, LinkOutline } from "@vicons/ionicons5";
import { AddLocationAltOutlined, AddReactionOutlined } from "@vicons/material";

const invitationCode = ref("");
const allTokenNum = ref("");
const totalTokenNum = ref("");
const timestamp = ref(new Date().getTime());
const selectedOptions = [
  {
    label: "总使用量",
    value: 0,
  },
  {
    label: "写作润色",
    value: 1,
  },
  {
    label: "智能批阅",
    value: 2,
  },
  {
    label: "智能翻译",
    value: 3,
  },
];
const selectedValue = ref(0);
const message = useMessage();
const chart = ref<echarts.ECharts | null>(null);

function updateChart(xData: number[], yData: number[]) {
  if (chart.value) {
    const option: echarts.EChartsOption = {
      title: {
        text: "每月 Token 使用量",
      },
      xAxis: {
        type: "category",
        data: xData,
      },
      yAxis: {
        type: "value",
      },
      series: [
        {
          data: yData,
          type: "line",
          emphasis: {
            label: {
              show: true,
            },
          },
        },
      ],
    };

    chart.value.setOption(option);
  }
}

async function loadInvitationCode() {
  //请求邀请码
  try {
    const req: InvitationCodeReq = {};
    const res = await getInvitationCode(req);
    invitationCode.value = res.code;
  } catch (err) {
    message.error("失败，请重试");
  }
}

async function loadAllTokenNum() {
  //请求token总数
  try {
    const req: AllTokenNumReq = {};
    const res = await getAllTokenNum(req);
    allTokenNum.value = res.all_token_num;
    totalTokenNum.value = res.total_token_num;
  } catch (err) {
    message.error("失败，请重试");
  }
}

async function getAllTokenNumSpecify() {
  const prompt_index = selectedValue.value;
  const date = new Date(timestamp.value);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  try {
    const req: TokenNumSpecifyReq = {
      prompt_index,
      year,
      month,
    };
    const res = await getTokenNumSpecify(req);
    const xData = Object.keys(res.month_token)
      .map(Number)
      .map((num) => num + 1);

    const yData = Object.values(res.month_token).map(Number);
    updateChart(xData, yData);
    if (res.status != STATUS_SUCCESS) {
      return;
    }
  } catch (err) {
    message.error("获取token失败");
  }
}

onMounted(() => {
  const token = getToken();

  if (!token) {
    router.push("login");
    return;
  }
  loadAllTokenNum();
  loadInvitationCode();
  chart.value = echarts.init(
    document.getElementById("chart-container") as HTMLDivElement
  );
  getAllTokenNumSpecify();
});
</script>
