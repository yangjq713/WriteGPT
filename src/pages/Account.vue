<template>
    <div class="flex h-full">
        <div class="grow">
            <div class="py-2 px-8 bg-white shadow-md rounded-md">
            <n-grid :x-gap="24">
                <n-grid-item span="6">
                <n-card :bordered="false" size="small" class="proCard">
                    <div style="margin: 30px 0px;">
                        <n-avatar :size="150" src="../../assets/img/momo.png"></n-avatar>
                    </div>
                    <n-thing
                    class="thing-cell"
                    v-for="item in typeTabList"
                    :key="item.key"
                    :class="{ 'thing-cell-on': type === item.key }"
                    @click="switchType(item)"
                    >
                    <template #header>{{ item.name }}</template>
                    <template #description>{{ item.desc }}</template>
                    </n-thing>
                </n-card>
                </n-grid-item>
                <n-grid-item span="18">
                <n-card :bordered="false" size="small"  class="proCard">
                    <BasicSetting v-if="type === 1" />
                    <SafetySetting v-if="type === 2" />
                </n-card>
                </n-grid-item>
                
            </n-grid>
        </div>
    </div>
  </div>
  </template>
  <script lang="ts" setup>
    import { ref } from 'vue';
    import BasicSetting from './account/BasicAccount.vue';
    import SafetySetting from './account/AdvancedAccount.vue';
    import { NThing, NCard, NGrid, NGridItem, NAvatar  } from 'naive-ui';
  
    const typeTabList = [
      {
        name: '基本设置',
        desc: '个人账户信息设置',
        key: 1,
      },
      {
        name: '单词使用',
        desc: '单词使用情况展示',
        key: 2,
      },
    ];
  
    const type = ref(1);
    const typeTitle = ref('基本设置');
  
    function switchType(e) {
      type.value = e.key;
      typeTitle.value = e.name;
    }
  </script>
  <style scoped>
    .thing-cell {
      margin: 0 -16px 10px;
      padding: 5px 16px;
  
      /* :hover {
        background-color: #f3f3f3;
        cursor: pointer;
      } */
    }
  
    .thing-cell-on {
      background: #f0faff;
      color: #2d8cf0;
  
      /* ::v-deep(.n-thing-main .n-thing-header .n-thing-header__title) {
        color: #2d8cf0;
      } */
  
      /* :hover {
        background: #f0faff;
      } */
    }
  </style>