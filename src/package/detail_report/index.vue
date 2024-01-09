<template>
  <cg-navbar title="完整报告" />
  <view class="detail_report" :style="getStyle" :catch-move="forbidden">
    <nut-overlay v-model:visible="forbidden">
      <div class="overlay-body">
        <div class="overlay-content">加载中...</div>
      </div>
    </nut-overlay>
    <div>
      <nut-tabs v-model="tabValueRef" swipeable @change="handleChange">
        <nut-tab-pane title="核心类型" pane-key="0">
          <div class="group flex tab0">
            <div class="single-avatar flex"></div>
            <div class="section flex">
              <img class="image_lr" referrerpolicy="no-referrer" :src="require('@/assets/images/ver-left.png')" />
              <span class="text_assistant">{{ getRenderDataToTitle }}</span>
              <img class="image_lr" referrerpolicy="no-referrer" :src="require('@/assets/images/ver-right.png')" />
            </div>
            <view class="taro_html" v-html="getRenderDataToHtml"></view>
          </div>
        </nut-tab-pane>
        <nut-tab-pane title="特质分析" pane-key="1" class="tab-warper-pane">
          <nut-swipe>
            <div class="flexCon tab-warper">
              <div
                v-for="(item, num) in getRenderDataToTezhi"
                class="button-wrapper flex-col"
                @click="HandleSelectTezhi(item, num)"
              >
                <span class="button-text" :style="getItemSelectStyle(item, num)">
                  {{ item?.name }}
                </span>
              </div>
            </div>
          </nut-swipe>
          <div class="chart-wraper">
            <div class="text-wrapper_1">
              <span class="text_11">
                <img class="image_3_line" :src="require('../../assets/images/threeline.png')" />
                <div class="image_text">{{ selectSelectItem?.name }}</div>
                <img class="image_3_line" :src="require('../../assets/images/threeliner.png')" />
              </span>
              <score-prograss :percent="selectSelectItem?.score" />
              <view class="bar-chart">
                <!-- <div>{{ selectIndex }}</div> -->
                <ec-canvas
                  v-if="ecRef"
                  id="mychart-dom-line"
                  :key="selectIndex"
                  canvas-id="mychart-line"
                  :ec="ec"
                  :force-use-old-canvas="true"
                ></ec-canvas>
              </view>
            </div>
          </div>
          <div class="group flex tab1">
            <div v-for="(sub, index) in selectSelectItem?.sub || []" class="spec_group flex-col">
              <div class="spec-title flex-row">
                <div class="spec-box"></div>
                <span class="spec-text">{{ sub.dimension }}</span>
              </div>
              <view class="" v-html="sub.overview"></view>
              <view class="" v-html="sub.desc"></view>
            </div>
          </div>
        </nut-tab-pane>
        <!-- <nut-tab-pane title="基本信息" pane-key="2">Tab 3</nut-tab-pane> -->
      </nut-tabs>
    </div>
  </view>
</template>
<script setup lang="ts">
import { it } from 'node:test';
import { onMounted, ref, reactive, computed, watch } from 'vue';
import Taro, { getEnv, showToast, pxTransform } from '@tarojs/taro';
import { IconFont } from '@nutui/icons-vue-taro';
import { EChart } from 'echarts-taro3-vue';
import { ScrollView } from '@tarojs/components';
import { fetchSeriesReport } from '@/service';
import { useAppStore, useProductInfoStore } from '@/store';
import * as echarts from '@/components/ec-canvas/echarts';
import mock from './mock.js';

const tabValueRef = ref('0');
const appStore = useAppStore();
const productInfoStore = useProductInfoStore();
const renderData = ref('');
const containerHeight = ref(0);
const contents = ref([]);
const tabIndex = ref(0);

const info = computed(() => productInfoStore.reportIds);

const ecRef = ref(false);

const forbidden = ref(false);

const getItemSelectStyle = (item: any, index: number) => {
  /// /console.log('item:::', item, index, selectIndex.value);
  return {
    color: selectIndex.value == index ? '#F1652B' : '#63676e'
  };
};

const getStyle = computed(() => {
  console.log('tabIndex:::', tabIndex.value);
  const val = {
    overflow: tabIndex.value == 0 ? 'hidden' : 'unset',
    marginTop: `${pxTransform(appStore.getNavHeight)}`,
    height: containerHeight.value > 0 ? `${containerHeight.value}px` : 'auto'
    // maxHeight: '3000px'
  };
  return val;
});

const getStyle2 = computed(() => {
  return {};
  const val = {
    // overflow: renderData.value && tabIndex.value == 0 ? 'hidden' : 'unset',
    // marginTop: `${pxTransform(appStore.getNavHeight)}`,
    height: containerHeight.value > 0 && tabIndex.value == 0 ? `${containerHeight.value}px` : 'auto'
    // maxHeight: '3000px'
  };
  return val;
});

const getRenderDataToHtml = computed(() => {
  return renderData.value?.[0]?.content || '';
});

const getRenderDataToTitle = computed(() => {
  return renderData.value?.[0]?.name || '';
});

const getRenderDataToTezhi = computed(() => {
  return renderData.value?.[1]?.content || [];
});

const getReport = async () => {
  forbidden.value = true;
  const report_id = info.value.report_id;
  console.log('productInfoStore.reportIds=111==', productInfoStore.reportIds);
  let res = {};
  if (getEnv() == 'WEB') {
    res = mock; // 测试
  } else {
    res = await fetchSeriesReport({
      reportid: report_id,
      detail: '1'
    });
  }

  console.log('detail-getReport-res:::', res);

  if (res.code != 1) {
    showToast({
      title: res.msg || '获取报告失败',
      icon: 'none'
    });
    return;
  }
  renderData.value = res.data;
  ecRef.value = true;
  contents.value = renderData.value?.[1]?.content || [];
  const arr = Object.keys(contents.value);
  selectIndex.value = arr[0];
  selectSelectItem.value = contents.value[selectIndex.value];

  handleChange({
    paneKey: 0
  });
  setTimeout(() => {
    forbidden.value = false;
  }, 2000);

  /// console.log('getReport-mock:::', mock);
  console.log('selectSelectItem::', selectSelectItem);
  console.log('getReport:::', arr, info, res, renderData);
};

const selectIndex = ref(0);
const selectSelectItem = ref(null);
const HandleSelectTezhi = (item: any, index: number) => {
  console.log('selectIndex:::', item, index);
  selectIndex.value = index;
  selectSelectItem.value = item;
  handleChange({
    paneKey: 1
  });
};

const handleChange = (arg: any) => {
  console.log('handleChange:::', arg, `tab${arg.paneKey}`);
  tabIndex.value = arg.paneKey;
  // if (arg.paneKey == 1) {
  //   tabOnce.value = true;
  // }
  Taro.nextTick(() => {
    const query = Taro.createSelectorQuery();
    query
      .select(`.tab${arg.paneKey}`)
      .boundingClientRect(res => {
        console.log('resized-res:::', res);
        const info = Taro.getSystemInfoSync();
        containerHeight.value = res.height + res.top / 2;
      })
      .exec();
  });
};

onMounted(async () => {
  getReport();
});

function initChart(canvas, width, height) {
  const chart = echarts.init(canvas, null, {
    width,
    height
  });
  canvas.setChart(chart);
  const sub = selectSelectItem.value?.sub;
  console.log('ec:::', sub);

  if (!sub) {
    return chart;
  }

  const names = Object.values(sub).map((it: any) => {
    return it.dimension;
  });

  const scores = Object.values(sub).map((it: any) => {
    return {
      value: it.score
      // itemStyle: {
      //   background: 'linear-gradient(to bottom,yellow,green)'
      // }
    };
  });

  console.log('ec:::===', Object.values(sub), names, scores);

  const option = {
    xAxis: {
      type: 'category',
      data: names,
      axisLabel: {
        interval: 0
      }
    },
    yAxis: {
      type: 'value',
      min: '5',
      max: '35',
      offset: -10
    },
    series: [
      {
        data: scores,
        type: 'bar',
        barWidth: 15, // 柱状宽度
        itemStyle: {
          // 柱状颜色和圆角
          // color: '#F43368',
          normal: {
            label: {
              show: true, // 开启显示
              position: 'top', // 在上方显示
              textStyle: {
                // 数值样式
                color: 'black',
                fontSize: 13
              }
            },
            barBorderRadius: [10, 10, 0, 0], // （顺时针左上，右上，右下，左下）
            color(params) {
              const colorList = [
                ['rgb(14,102,179)', 'rgb(51,36,169)'],
                ['#F5cF0D', '#fa9203'],
                ['#61dbe8', '#0785de'],
                ['#ff9717', '#ff4518']
              ];
              let index = params.dataIndex;
              if (params.dataIndex >= colorList.length) {
                index = params.dataIndex - colorList.length;
              }
              return new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: colorList[index][0]
                },
                {
                  offset: 1,
                  color: colorList[index][1]
                }
              ]);
            }
          }
          // color: {
          //   type: 'linear',
          //   x: 0,
          //   y: 0,
          //   x2: 0,
          //   y2: 1,
          //   colorStops: [
          //     { offset: 0, color: '#fc6b53' },
          //     { offset: 1, color: '#ffd0c9' }
          //   ]
          // },
          // barBorderRadius: [10, 10, 0, 0] // （顺时针左上，右上，右下，左下）
        }
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
