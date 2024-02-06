<script lang="ts" setup>
import {
  NConfigProvider,
  NMessageProvider,
  NDialogProvider,
  NLoadingBarProvider,
  zhCN,dateZhCN
} from "naive-ui";
/**
 * js 文件下使用这个做类型提示
 * @type import('naive-ui').GlobalThemeOverrides
 */
const themeOverrides = {
  common: {
    primaryColor: "#3b82f6",
    primaryColorPressed: "#2563eb",
    primaryColorHover: "#2563eb",
    primaryColorSuppl: "#2563eb",
  },
};

</script>
<template>
  <n-config-provider :theme-overrides="themeOverrides" :locale="zhCN" :date-locale="dateZhCN">
    <n-dialog-provider>
      <n-message-provider>
        <n-loading-bar-provider>
          <router-view></router-view>
        </n-loading-bar-provider>
      </n-message-provider>
    </n-dialog-provider>
  </n-config-provider>
</template>
