<template>
  <n-modal
    v-model:show="setDownloadModal"
    :mask-closable="false"
    preset="dialog"
    title="下载格式"
    positive-text="确认下载"
    negative-text="取消"
    @positive-click="formSubmit(downloadModal)"
  >
    <n-dropdown
      trigger="hover"
      :options="downloadOptions"
      @select="handleSelect"
      size="large"
    >
      <n-button>{{ downloadModal }}</n-button>
    </n-dropdown>
  </n-modal>
</template>
<script lang="ts" setup>
import { ref, toRefs } from "vue";
import { downloadDocs, downloadMd } from "../utils/download";
import { NModal, NDropdown, NButton } from "naive-ui";

const props = defineProps({
  originText: {
    type: String,
    default: "",
  },
  resOriginText: {
    type: String,
    default: "",
  },
  resText: {
    type: String,
    default: "",
  },
  setDownloadModal: {
    type: Boolean,
    default: false,
  },
});
const { originText, resText, setDownloadModal, resOriginText } = toRefs(props);
const downloadOptions = [
  {
    label: "DOC",
    key: "DOC",
  },
  {
    label: "MD",
    key: "MD",
  },
];
const downloadModal = ref("选择下载格式");
function handleSelect(key: string | number) {
  downloadModal.value = String(key);
}
function formSubmit(type: string) {
  if (type == "DOC") {
    downloadDocs(originText.value, resOriginText.value);
  } else {
    downloadMd(originText.value, resText.value);
  }
}
</script>
