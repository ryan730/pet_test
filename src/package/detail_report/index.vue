<template>
  <cg-navbar2 title="完整报告" />
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
            <div class="single-avatar flex">
              <img class="image_1" :src="getRenderDataToPic" />
            </div>
            <div class="section flex">
              <img class="image_lr" referrerpolicy="no-referrer" :src="require('@/assets/images/ver-left.png')" />
              <span class="text_assistant">{{ getRenderDataToTitle }}</span>
              <img class="image_lr" referrerpolicy="no-referrer" :src="require('@/assets/images/ver-right.png')" />
            </div>
            <view class="taro_html" v-html="getRenderDataToHtml"></view>
          </div>
        </nut-tab-pane>
        <nut-tab-pane title="特质分析" pane-key="1" class="tab-warper-pane-analyze">
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
              <score-prograss
                :percent="selectSelectItem?.score"
                :min="getPgAttr.min"
                :max="getPgAttr.max"
                :step="getPgAttr.step"
              />
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
            <div v-if="selectSelectItem?.desc">
              <view class="taro_html" v-html="selectSelectItem.desc"></view>
            </div>
            <div v-for="(sub, index) in selectSelectItem?.sub || []" v-else class="spec_group flex-col">
              <div class="spec-title flex-row">
                <div class="spec-box"></div>
                <span class="spec-text">{{ sub.dimension }}</span>
              </div>
              <view class="" v-html="sub.overview"></view>
              <view class="" v-html="sub.desc"></view>
            </div>
          </div>
          <div style="width: 100%; height: 60px"></div>
        </nut-tab-pane>
        <!-- <nut-tab-pane title="基本信息" pane-key="2" class="tab-warper-pane-base">
          <div class="baseInfo-group tab2">
            <div class="base_info_group">
              <div class="base_group_title">
                <div class="base_info_title_text">
                  <div class="base_info_title_txt"></div>
                  <span class="base_text_base_span">基本信息</span>
                </div>
              </div>
              <div class="base_text_wrapper_gender">
                <span class="base_text_label">你的汪星人性别：</span>
                <span class="base_text_txt">&nbsp;男生</span>
              </div>
              <img class="base_mage" referrerpolicy="no-referrer" :src="require('../../assets/images/pic276.png')" />
              <div class="base_text_wrapper_age">
                <span class="base_text_age">你的汪星人年龄：</span>
                <span class="base_age_txt">&nbsp;8岁</span>
              </div>
            </div>
            <span class="base_text_explanation">阅读说明</span>
            <div class="base_label_notice">
              <span class="base_text_notice_title">感谢您的参与，阅读本报告时，请注意以下事项：</span>
              <div>
                <div class="base_info_title_text">
                  <div class="base_reader_sub"></div>
                  <span class="text_base_reader_sub">本报告为专业测评结果，建议你在分享时务必谨慎。</span>
                </div>
                <div class="base_info_title_text">
                  <div class="base_reader_sub"></div>
                  <span class="text_base_reader_sub">本报告为专业测评结果，建议你在分享时务必谨慎。</span>
                </div>
                <div class="base_info_title_text">
                  <div class="base_reader_sub"></div>
                  <span class="text_base_reader_sub">本报告为专业测评结果，建议你在分享时务必谨慎。</span>
                </div>
              </div>
            </div>
          </div>
        </nut-tab-pane> -->
      </nut-tabs>
    </div>
  </view>
  <div
    v-if="favorShowRef"
    class="base_favorite"
    :style="{ paddingBottom: `${designToRealForPX(appStore.bottomArea.bottomH)}px` }"
  >
    <div class="con_favorite">
      <span class="base_favorite_text">亲，结果准确吗？</span>
      <img
        v-for="(item, index) in favoritesRef"
        :key="index"
        :style="{ opacity: item.active ? 1 : 0.2 }"
        class="base_favorite_img"
        referrerpolicy="no-referrer"
        :src="require('../../assets/images/faver.png')"
        @click="handleFavoriteSelect(item, index)"
      />
      <button class="button_favorite" @click="handleSendFavorite">
        <span class="base_text_favorite">提交</span>
      </button>
    </div>
  </div>
</template>
<script setup lang="ts">
import { onMounted, ref, reactive, computed, watch } from 'vue';
import Taro, { getEnv, showToast, pxTransform } from '@tarojs/taro';
import { IconFont } from '@nutui/icons-vue-taro';
import { EChart } from 'echarts-taro3-vue';
import { ScrollView } from '@tarojs/components';
import { fetchSeriesReport, fetchScoreTest } from '@/service';
import { useAppStore, useProductInfoStore } from '@/store';
import * as echarts from '@/components/ec-canvas/echarts';
import { designToRealForPX, getURLParamsPID, getAnimaoType } from '@/utils/common';
import mock from './mock.js';

const favorShowRef = ref(false);
const tabValueRef = ref('0');
const appStore = useAppStore();
const productInfoStore = useProductInfoStore();
const renderData = ref('');
const containerHeight = ref(0);
const contents = ref([]);
const tabIndex = ref(0);
const favoritesRef = ref([
  {
    index: 0,
    active: true
  },
  {
    index: 1,
    active: true
  },
  {
    index: 2,
    active: true
  },
  {
    index: 3,
    active: true
  },
  {
    index: 4,
    active: true
  }
]);

const info = computed(() => productInfoStore.report);

const ecRef = ref(false);

const forbidden = ref(false);

const getPgAttr = computed(() => {
  const pid = getURLParamsPID();
  const isDog = getAnimaoType(pid) == 'dog';
  if (isDog) {
    return {
      min: 5,
      max: 35,
      step: 5
    };
  }
  return {
    min: 10,
    max: 100,
    step: 15
  };
});

const getItemSelectStyle = (item: any, index: number) => {
  /// /console.log('item:::', item, index, selectIndex.value);
  return {
    color: selectIndex.value == index ? '#F1652B' : '#63676e'
  };
};

const getStyle = computed(() => {
  console.log('tabIndex:::', tabIndex.value);
  const val = {
    overflow: tabIndex.value == 0 || tabIndex.value == 2 ? 'hidden' : 'unset',
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
  //   return `
  // 	<div class="repo-box flex-col"><div class="repo-text-container"><span class="repo-title">猫咪性格特征：</span></div>
  // <span class="repo-content">你的猫咪属于胆小鬼型，TA性格比较谨小慎微，当你把TA带回家后，TA可能很长一段时间都会躲在暗处偷偷观察你。在面对新环境和陌生人时，这类猫咪通常会表现出警惕和谨慎的态度，不轻易展现自己。它们可能会选择躲藏或者保持距离，尽量避免冒险和接触陌生环境。这样的猫咪可能需要更长的时间来适应新的家庭和主人，因此在刚开始的阶段，你可能很难发现它们的存在。</span>
  // <span class="repo-content">尽管胆小鬼型的猫咪在短时间内不容易与人建立亲密关系，甚至可能会受到惊吓或者受伤，但在与你熟悉后，它们会变得更加依赖人。由于它们性格上的胆小和敏感，一旦建立了信任关系，它们可能会成为非常黏人的猫咪，时刻在你身边寻求安全感和保护。</span></div>
  // <div class="repo-box flex-col"><div class="repo-text-container"><span class="repo-title">与猫咪相处之道：</span></div>
  // <span class="repo-content">要与胆小鬼型的猫咪相处愉快，首先需要给予它们足够的宁静和安全感。新环境对这类猫咪来说可能是一个巨大的挑战，因此需要在熟悉和接纳他们的过程中给予更多的耐心和理解。你需要为猫咪提供一个温暖、安静的空间，让它们可以自由地探索和适应新的环境，同时也要避免嘈杂或激动的场景，以免让它们感到惊恐和紧张。</span>
  // <span class="repo-content">在初期的相处时期，你可以选择坐在离猫咪稍远的地方，避免直接朝着它们，试图主动接触或者引导，让它们有足够的时间来逐渐接触和接受你的存在。适当的主动互动和沟通可以让猫咪感受到你的关爱和温暖，建立起对你的信任和依赖。</span>
  // <span class="repo-content">另外，家里的环境设计也非常重要，需要为猫咪提供足够的藏身之地，比如箱子、窝和高处等，让它们有安全感和自由的空间，以便适应新的生活环境。同时，给予它们一定的自由，让它们逐渐去适应并消除对新环境的紧张感。</span></div>
  // <div class="repo-text-info flex-col"><span class="repo-text-head">训练建议：</span></div>
  // <div class="repo-text-info-con flex-col">
  // <span class="repo-text-black">对于胆小鬼型的猫咪，训练需要更多的耐心和细心，切忌强行操作或者过度刺激。首先需要尊重猫咪的个体差异和行为习性，不要过于强求亲密关系，要给予猫咪足够的时间和空间去适应新环境和主人。逐步培养猫咪对你的信任和依赖，通过与猫咪互动和接触来增进你们之间的感情。</span>
  // <span class="repo-text-black">在与胆小鬼型猫咪的训练过程中，需要使用正面的强化方式，比如给予食物奖励、赞美和安抚的方式来进行引导和反馈。避免使用惩罚的方式来训练，以免造成猫咪的逆反心理和伤害。因为这类猫咪对于外部刺激和情绪波动都比较敏感，需要在训练过程中特别小心和细致。</span></div>
  // 	`;
  return renderData.value?.[0]?.content || '';
});

const getRenderDataToTitle = computed(() => {
  return renderData.value?.[0]?.name || '';
});

const getRenderDataToTezhi = computed(() => {
  return renderData.value?.[1]?.content || [];
});

const getRenderDataToPic = computed(() => {
  /// return 'https://storage.360buyimg.com/mtd/home/111543234387022.jpg';
  return renderData.value?.[0]?.image || renderData.value?.[0]?.img || '';
});

const getReport = async () => {
  forbidden.value = true;
  const report_id = info.value.report_id;
  console.log('productInfoStore.getReport==', report_id, productInfoStore.report);
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

const handleFavoriteSelect = (item: any) => {
  console.log('handleFavoriteSelect:::', item);
  const bol = !item.active;
  favoritesRef.value.map((it: any) => {
    if (bol) {
      if (it.index <= item.index) {
        it.active = true;
      } else {
        it.active = false;
      }
    } else if (!bol) {
      if (it.index >= item.index) {
        it.active = false;
      } else {
        it.active = true;
      }
    }
  });
};

const handleSendFavorite = async () => {
  console.log('handleFavorite:::', info.value.report_id, favoritesRef.value?.filter((it: any) => it.active)?.length);
  const res = await fetchScoreTest({
    rids: info.value.report_id,
    score: favoritesRef.value?.filter((it: any) => it.active)?.length || 5
  });
  if (res?.code == 1) {
    showToast({
      title: '提交成功',
      icon: 'none'
    });
    favorShowRef.value = false;
  } else {
    showToast({
      title: '提交失败',
      icon: 'none'
    });
  }
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
  favorShowRef.value = info.value.score == 0;
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

// http://localhost:10086/#/package/detail_report/index
</script>

<style src="./index.scss" lang="scss" />
<style src="./echarts.scss" lang="scss" />
<style src="./template.scss" lang="scss" />
