<template>
  <cg-navbar title="测评报告" />
  <div class="simply_report flex-col" :style="getStyle">
    <div class="group_3 flex-col">
      <span class="text_3">核心类型：</span>
      <div class="single-avatar_1 flex-col"></div>
      <div class="section_1 flex-row">
        <img class="image_3" referrerpolicy="no-referrer" :src="require('@/assets/images/ver-left.png')" />
        <span class="text_4">助手类型</span>
        <img class="image_4" referrerpolicy="no-referrer" :src="require('@/assets/images/ver-right.png')" />
      </div>
      <div class="section_2 flex-col">
        <view class="taro_html" v-html="renderData[0].text"></view>
        <!-- <div class="group_4 flex-row justify-between">
          <div class="box_1 flex-col"></div>
          <span class="text_5">性格</span>
        </div>
        <span class="text_6">这类狗通常具有较强的执行能力，并愿意执行指示、支持其他人以完成共同的目标。</span>
        <div class="group_5 flex-row justify-between">
          <div class="group_6 flex-col"></div>
          <span class="text_7">相处之道</span>
        </div>
        <span class="text_8">
          与这类狗相处，您需要给予它们明确的任务和指示，并提供积极的支持和反馈。同时，与这类狗一起工作时，应尝试与他们建立积极合作的关系。
        </span>
        <div class="group_7 flex-row justify-between">
          <div class="block_1 flex-col"></div>
          <span class="text_9">训练方法</span>
        </div>
        <span class="text_10">
          注重强化这类狗的执行能力和合作意识。使用正向激励和有效的任务分配，帮助他们更好地实现任务。
        </span> -->
      </div>
      <div class="chart_1 flex-col">
        <div class="text-wrapper_1 flex-row">
          <span class="text_11">核心特质剖面图</span>
        </div>
        <!-- <view class="bar-chart">
          <e-chart ref="vueref0" canvas-id="bar-canvas" />
        </view> -->
      </div>
    </div>
    <div class="group_10 flex-col">
      <button class="button_1 flex-col" @click="onClick_1">
        <span class="text_26">查看完整解读报告</span>
      </button>
    </div>
  </div>
</template>
<script setup lang="ts">
import { onMounted, ref, reactive, computed, watch } from 'vue';
import Taro, { getEnv, showToast, pxTransform } from '@tarojs/taro';
import { IconFont } from '@nutui/icons-vue-taro';
// import { EChart } from 'echarts-taro3-vue';
import { fetchSeriesReport } from '@/service';
import { useAppStore, useProductInfoStore } from '@/store';
import mock from './mock.js';

const renderData = ref([]);
const appStore = useAppStore();
const productInfoStore = useProductInfoStore();

const count = computed(() => appStore.getCurrTopicProcess);
const info = computed(() => productInfoStore.getInfo);

const isHeightOverFlow = ref(false);

const contentHeight = ref(0);

const env = getEnv();
/// const info = Taro.getSystemInfoSync();

const getStyle = computed(() => {
  const val = {
    marginTop: `${pxTransform(appStore.getNavHeight)}`
    // height: `${contentHeight.value}px` // isHeightOverFlow.value ? `${contentHeight.value + appStore.getNavHeight}px` : `100%` // `calc(100% - ${appStore.getNavHeight}px)`
  };
  console.log('getStyle:::', isHeightOverFlow.value, contentHeight.value, val);
  return val;
});

const resized = () => {
  // setTimeout(() => {
  //   const query = Taro.createSelectorQuery();
  //   query
  //     .select('.block')
  //     .boundingClientRect(res => {
  //       const info = Taro.getSystemInfoSync();
  //       contentHeight.value = info.windowHeight - res.height - appStore.getNavHeight / 2; // res.height;
  //     })
  //     .exec();
  // }, 200);
};

const getReport = async () => {
  const report_id = info.value.report_id;
  let res = await fetchSeriesReport({
    reportid: report_id
  });
  // const content = res.data?.[0]?.tab?.[0];
  // renderData.value = content?.content?.[0]?.data;
  res = mock; // 测试

  if (res.code != 1) {
    showToast({
      title: res.msg || '获取报告失败',
      icon: 'none'
    });
    return;
  }
  renderData.value = res.data;

  console.log('getReport-mock:::', mock);
  console.log('getReport:::', info, res, renderData);
};

onMounted(async () => {
  getReport();
  resized();
});
</script>

<style src="./index.scss" lang="scss" />
<style src="./template.css" />
