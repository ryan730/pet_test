<template>
  <cg-navbar title="完整报告" />
  <div class="detail_report" :style="getStyle">
    <div>
      <nut-tabs v-model="tabValueRef">
        <nut-tab-pane title="核心类型" pane-key="0">
          <div class="group flex">
            <div class="single-avatar flex"></div>
            <div class="section flex">
              <img class="image_lr" referrerpolicy="no-referrer" :src="require('@/assets/images/ver-left.png')" />
              <span class="text_assistant">助手类型</span>
              <img class="image_lr" referrerpolicy="no-referrer" :src="require('@/assets/images/ver-right.png')" />
            </div>
            <view class="taro_html" v-html="getRenderDataToHtml"></view>
          </div>
        </nut-tab-pane>
        <nut-tab-pane title="特质分析" pane-key="1">
          <nut-swipe>
            <div class="flexCon">
              <div v-for="(item, index) in getRenderDataToTezhi" class="button-wrapper flex-col">
                <span class="button-text">{{ item.name }}</span>
              </div>
            </div>
          </nut-swipe>
        </nut-tab-pane>
        <nut-tab-pane title="基本信息" pane-key="2">Tab 3</nut-tab-pane>
      </nut-tabs>
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

const tabValueRef = ref('0');
const appStore = useAppStore();
const productInfoStore = useProductInfoStore();
const renderData = ref('');

const info = computed(() => productInfoStore.getInfo);

const getStyle = computed(() => {
  const val = {
    marginTop: `${pxTransform(appStore.getNavHeight)}`
  };
  return val;
});

const getRenderDataToHtml = computed(() => {
  return renderData.value?.[0]?.content || '';
});

const getRenderDataToTezhi = computed(() => {
  return renderData.value?.[1]?.content || [];
});

const getReport = async () => {
  const report_id = info.value.report_id;
  const res = await fetchSeriesReport({
    reportid: report_id,
    detail: '1'
  });

  /// /const res = mock; // 测试

  console.log('detail-getReport-res:::', res);

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
});
</script>

<style src="./index.scss" lang="scss" />
<style src="./echarts.scss" lang="scss" />
<style src="./template.css" />
