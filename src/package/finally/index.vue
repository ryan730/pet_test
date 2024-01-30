<template>
  <cg-navbar title="恭喜完成" />
  <div class="finally" :style="getStyle">
    <div class="block">
      <div class="header">
        <span class="summary">
          根据过去两周的状况，请您回答是否存在下列描述的状况及频率，请看清楚问题后选择符合您情况的选项。
        </span>
      </div>
      <div class="body">
        <div class="wrapper">
          <span class="caption-1">
            <img class="light" :src="require('../../assets/images/light.png')" />
            答题时需要注意以下事项
          </span>
          <span class="caption-2">&nbsp▪ 凭第一反应回答，不需要考虑太多</span>
          <span class="caption-3">&nbsp▪ 题目没有好与坏，对与错之分</span>
        </div>
        <div class="wrapper-chart">
          <img :src="`${getPic.char}`" />
        </div>
      </div>
    </div>
    <div class="block-1">
      <div class="header-1">
        <div class="wrapper-5">
          <!-- <div class="group-6"><span class="num">7</span></div> -->
        </div>
      </div>
      <div class="body-1">
        <div class="wrapper-6">
          <img :src="`${getPic.fchar}`" />
        </div>
        <span class="title-1">恭喜您完成测试</span>
        <div class="title-wrapper" :style="{ backgroundColor: theme.color }" @click="handleClickToRepot">
          <span class="title-2">查看我的测评结果</span>
        </div>
        <span class="desc">您今后可以在【我的测评】中找到您测试过的报告</span>
        <!-- <div class="wrapper-7"><span class="logout">保存并退出</span></div> -->
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { onMounted, ref, reactive, computed, watch } from 'vue';
import Taro, { getEnv, showToast, pxTransform } from '@tarojs/taro';
import { IconFont } from '@nutui/icons-vue-taro';
import { fetchTestTopic } from '@/service';
import { useAppStore } from '@/store';
import { debounce } from '@/utils';
import { getAnimaoType, getAnimaoPic, getURLParamsPID, designToRealForPX } from '@/utils/common';
import useShare from '@/hooks/useShare';
//import mock from './mock.js';

const { onShareAppMessage, onShareTimeline, shareConfig } = useShare();

// /** 设置页面属性 */
definePageConfig({
  navigationBarTitleText: '宠物性格测试',
  enableShareAppMessage: true, // 分享好友
  enableShareTimeline: true // 分享朋友圈
});

const topics = ref([]);
const number = ref(0);
const total = ref(0);
const topic = ref({});
const currentNumb = ref(0);

const appStore = useAppStore();

const count = computed(() => appStore.getCurrTopicProcess);

const isHeightOverFlow = ref(false);

const contentHeight = ref(0);

const env = getEnv();
/// const info = Taro.getSystemInfoSync();

const launchInfo = Taro.getLaunchOptionsSync();
const getPic = computed(() => {
  const pid = getURLParamsPID();
  return getAnimaoPic(pid);
});
const theme = computed(() => {
  const pid = getURLParamsPID();
  const isDog = getAnimaoType(pid) == 'dog';
  return {
    color: isDog ? '#ff7237' : '#ffa000'
  };
});

// const getStyle = computed(() => {
//   const val = {
//     marginTop: `${pxTransform(appStore.getNavHeight)}`,
//     height: `${contentHeight.value}px` // isHeightOverFlow.value ? `${contentHeight.value + appStore.getNavHeight}px` : `100%` // `calc(100% - ${appStore.getNavHeight}px)`
//   };
//   console.log('getStyle:::', isHeightOverFlow.value, contentHeight.value, val);
//   return val;
// });

const getStyle = computed(() => {
  const navHeight = designToRealForPX(appStore.getNavHeight);
  return {
    paddingTop: `${pxTransform(appStore.getNavHeight)}`,
    height: `${Taro.getSystemInfoSync().windowHeight - navHeight}px` // `calc(100% - ${appStore.getNavHeight}px)`
  };
});

const resized = () => {
  setTimeout(() => {
    const query = Taro.createSelectorQuery();
    query
      .select('.block')
      .boundingClientRect(res => {
        const info = Taro.getSystemInfoSync();
        contentHeight.value = info.windowHeight - res.height - appStore.getNavHeight / 2; // res.height;
      })
      .exec();
  }, 200);
};

const handleClickToRepot = () => {
  // productInfoStore.setReport({
  //   report_id: item.reportids, // ['600', '601']
  //   score: item.score
  // });
  Taro.navigateTo({
    url: '/package/simple_report/index'
  });
};

onMounted(async () => {
  resized();
});
</script>

<style src="./index.scss" lang="scss" />
;
