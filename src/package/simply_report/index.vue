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
        <view class="taro_html" v-html="getRenderDataToHtml"></view>
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
        <div class="text-wrapper_1">
          <span class="text_11">核心特质剖面图</span>
          <view class="bar-chart">
            <ec-canvas id="mychart-dom-line" canvas-id="mychart-line" :ec="ec" :force-use-old-canvas="true"></ec-canvas>
          </view>
        </div>
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
import { EChart } from 'echarts-taro3-vue';
import { fetchSeriesReport } from '@/service';
import { useAppStore, useProductInfoStore } from '@/store';
import * as echarts from '@/components/ec-canvas/echarts';
import mock from './mock.js';

const renderData = ref('');
const appStore = useAppStore();
const productInfoStore = useProductInfoStore();

const vueref0 = ref(null);

const count = computed(() => appStore.getCurrTopicProcess);
const info = computed(() => productInfoStore.getInfo);

const isHeightOverFlow = ref(false);

const contentHeight = ref(0);

const env = getEnv();

const getRenderDataToHtml = computed(() => {
  return renderData.value?.[0]?.text || '';
});

const getRenderDataToScore = computed(() => {
  return renderData.value?.[1] || [];
});

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
  const res = await fetchSeriesReport({
    reportid: report_id
  });
  // const content = res.data?.[0]?.tab?.[0];
  // renderData.value = content?.content?.[0]?.data;
  // res = mock; // 测试

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

function initChart(canvas, width, height) {
  const chart = echarts.init(canvas, null, {
    width,
    height
  });
  canvas.setChart(chart);

  console.log('item====1==:::', getRenderDataToScore.value);

  const dataData = [];

  const indicator = getRenderDataToScore.value
    ? Object.keys(getRenderDataToScore.value).map((item: any, index: number) => {
        const ind = getRenderDataToScore.value[item];
        dataData.push(ind.score);
        const val = { name: ind.name, max: 80 };
        if (index === 0) {
          val.axisLabel = { show: true };
        }
        return val;
      })
    : [];

  const option = {
    title: {
      text: ''
    },
    legend: {
      // data: ['Allocated Budget', 'Actual Spending']
      data: []
    },
    radar: {
      // shape: 'circle',
      // formatter: text => {
      //   const _text = text.replace(/\s(3]/g, match => {
      //     console.log(match);
      //     return `${match}\n`;
      //   });
      //   return _text;
      // },
      name: {
        textStyle: {
          padding: [-10, -12] // 控制文字padding
        }
      },
      center: ['50%', '35%'], // 位置
      radius: 85, // 缩放
      indicator
    },
    series: [
      {
        name: 'all',
        type: 'radar',
        itemStyle: {
          // 此属性的颜色和下面areaStyle属性的颜色都设置成相同色即可实现
          color: '#cc0000'
          // borderColor: '#cc0000'
        },
        data: [
          {
            value: dataData,
            name: 'a',
            label: {
              normal: {
                show: true,
                formatter(params) {
                  return params.value;
                }
              }
            }
          }
          // {
          //   value: [5000, 14000, 28000, 26000, 42000, 21000],
          //   name: 'Actual Spending'
          // }
        ]
      }
    ]
  };

  chart.setOption(option);
  return chart;
}

const ec = {
  onInit: initChart
};
</script>

<style src="./index.scss" lang="scss" />
<style src="./echarts.scss" lang="scss" />
<style src="./template.css" />
