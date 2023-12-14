<template>
  <cg-navbar title="答题" />
  <div class="answer" :style="getStyle">
    <div class="block">
      <div class="header">
        <span class="summary">
          根据过去两周的状况，请您回答是否存在下列描述的状况及频率，请看清楚问题后选择符合您情况的选项。
        </span>
      </div>
      <div class="body">
        <div class="wrapper">
          <span class="caption-1">答题时需要注意以下事项</span>
          <span v-if="true" class="caption-2">凭第一反应回答，不需要考虑太多</span>
          <span class="caption-3">题目没有好与坏，对与错之分</span>
        </div>
        <div class="wrapper-chart">
          <img :src="`${getPic.char}`" />
        </div>
      </div>
    </div>
    <div class="content-container">
      <div class="header-1">
        <div class="wrapper-4" />
        <div class="wrapper-5">
          <div class="button-wrapper">
            <span class="button">{{ number }}/{{ total }}</span>
          </div>
        </div>
      </div>
      <div class="body-1">
        <div class="title-wrapper">
          <span class="title-1">{{ topic?.title }}</span>
        </div>
        <div
          v-for="(item, index) in topic?.content"
          class="btn-wrapper-item"
          :style="getActive(item, index)"
          @click="handleItem(item, index)"
        >
          <span class="btn">{{ item.text }}</span>
        </div>
        <div class="btn-next-prev">
          <nut-cell>
            <div v-show="appStore.getCurrTopicProcess > 1" class="prev" @click="handlePrev">上一题</div>
          </nut-cell>
          <nut-cell>
            <div v-show="appStore.getCurrTopicProcess < total" class="next" @click="handleNext">下一题</div>
          </nut-cell>
        </div>
        <div class="wrapper-6">
          <!-- <img class="item" src="./images/img_9.png" /> -->
        </div>
        <div class="body-bg">
          <img ref="bgRef" class="bg" :style="{ top: bgTopRef }" :src="require('@/assets/images/bg.png')" />
        </div>
      </div>
    </div>
  </div>
  <div class="footer-container">
    <nut-cell>
      <IconFont v-show="appStore.getCurrTopicProcess > 1" name="rect-left" size="24" @click="handlePrev"></IconFont>
    </nut-cell>
    <nut-cell>
      <IconFont
        v-show="appStore.getCurrTopicProcess < total"
        name="rect-right"
        size="24"
        @click="handleNext"
      ></IconFont>
    </nut-cell>
  </div>
</template>
<script setup lang="ts">
import { onMounted, ref, reactive, computed, watch } from 'vue';
import Taro, { getEnv, showToast, pxTransform } from '@tarojs/taro';
import { IconFont } from '@nutui/icons-vue-taro';
import { fetchTestTopic, fetchUserTopic, fetchProductInfo } from '@/service';
import { useAppStore, useProductInfoStore } from '@/store';
import { debounce, sleep } from '@/utils';
import { getAnimaoType, getAnimaoPic } from '@/utils/common';
import mock from './mock.js';

const topics = ref([]);
const total = ref(0);
const topic = ref({});
const answeRef = ref('');
const bgTopRef = ref(0);
const bgRef = ref(null);
const bgHeight = ref(0);

const number = computed(() => Number(appStore.getCurrTopicProcess));
const currentAnswerNumb = ref(-1); // 当前答题选项,-1表示未选择

const productInfoStore = useProductInfoStore();

const launchInfo = Taro.getLaunchOptionsSync();
const getPic = computed(() => {
  return getAnimaoPic(launchInfo?.query?.pid);
});
const theme = computed(() => {
  const isDog = getAnimaoType(launchInfo?.query?.pid) == 'dog';
  return {
    color: isDog ? '#ff7237' : '#ffa000'
  };
});

const info = computed(() => productInfoStore.getInfo);

const appStore = useAppStore();

const isHeightOverFlow = ref(false);

const contentHeight = ref(0);

const env = getEnv();
/// const info = Taro.getSystemInfoSync();

const getStyle = computed(() => {
  const val = {
    marginTop: `${pxTransform(appStore.getNavHeight)}`,
    height: isHeightOverFlow.value ? `${contentHeight.value + appStore.getNavHeight}px` : `100%` // `calc(100% - ${appStore.getNavHeight}px)`
  };
  console.log('getStyle:::', isHeightOverFlow.value, contentHeight.value, val);
  return val;
});

// 检查是否做第二套题
const continueNextSection = async () => {
  const result = await fetchProductInfo({
    pid: 46
  });
  productInfoStore.setInfo(result.data);
  const test_info = result.data?.test_info;
  if (test_info) {
    console.log('continueNextSection::', result.data);
    Taro.showToast({
      title: '开始第二段答题',
      icon: 'none',
      duration: 2000
    });
    const process = test_info?.process || 1;
    appStore.setCurrTopicProcess(process); // 第二次的进度值
    await init();
  } else {
    Taro.showToast({
      title: '去往结果页',
      icon: 'none',
      duration: 2000
    });
    setTimeout(() => {
      Taro.navigateTo({
        url: '/package/finally/index'
      });
    }, 2000);
  }
};

const handlePrev = () => {
  let currTopicProcess = appStore.getCurrTopicProcess;
  // eslint-disable-next-line no-plusplus
  currTopicProcess--;
  if (currTopicProcess <= 1) {
    currTopicProcess = 1;
  }
  appStore.setCurrTopicProcess(currTopicProcess);
  console.log('handlePrev:', currTopicProcess, appStore.getCurrTopicProcess);
};

const handleNext = () => {
  if (currentAnswerNumb.value === -1) {
    Taro.showToast({
      title: '必须选择一项！',
      icon: 'none',
      duration: 2000
    });
    return;
  }
  let currTopicProcess = appStore.getCurrTopicProcess;
  // eslint-disable-next-line no-plusplus
  currTopicProcess++;
  if (currTopicProcess > total.value) {
    currTopicProcess = total.value;
    continueNextSection();
  }
  appStore.setCurrTopicProcess(currTopicProcess);
  console.log('handleNext:', currTopicProcess, appStore.getCurrTopicProcess);
};

const getActive = (item: any, index: number) => {
  if (currentAnswerNumb.value === index) {
    return {
      // 'background-color': 'rgba(249, 216, 110, 1)'
      'background-color': theme.value.color
    };
  }
};

const sendAnswer = async () => {
  console.log('sendAnswer:::', currentAnswerNumb.value);
  if (currentAnswerNumb.value === -1) {
    console.log('没有选择项目');
    return;
  }
  let res = null;
  console.log('当前题号:', appStore.getCurrTopicProcess, total.value);
  try {
    res = await fetchUserTopic({
      utid: info.value?.test_info?.utid,
      test_id: info.value?.test_info?.test_id,
      number: appStore.getCurrTopicProcess,
      answer: answeRef.value,
      last: appStore.getCurrTopicProcess == Number(total.value) ? '1' : '0'
    });
  } catch (e) {
    console.log(e);
  }
  console.log('sendAnswer::', res);
};

const handleItem = async (item: any, index: number) => {
  console.log('handleItem:', item, index, currentAnswerNumb.value);
  /// debounce(() => {
  if (index === currentAnswerNumb.value) {
    return;
  }
  currentAnswerNumb.value = index;
  answeRef.value = item.value;
  const send = await sendAnswer();
  if (send?.code != 1) {
    await sleep(1500);
    handleNext();
  } else {
    showToast({
      title: '提交失败，请重试！',
      icon: 'none',
      duration: 2000
    });
    currentAnswerNumb.value = -1;
  }
};

const init = async () => {
  let res = null;
  try {
    res = await fetchTestTopic({
      utid: info.value?.test_info?.utid,
      test_id: info.value?.test_info?.test_id,
      cur: appStore.getCurrTopicProcess // 如果是0,强制跳到1
    });
  } catch (e) {
    console.log(e);
  }
  console.log('data=======>>>', res?.data);
  topics.value = res?.data?.topics; // mock?.data?.topics;
  total.value = res?.data?.total; // 3; // mock?.data?.total;
  topic.value = topics.value[0]; // topics.value[parseInt(Math.random() * 3)];

  const process = res?.data?.process; // 如果是0,强制跳到1
  const content = topic?.value?.content;
  const checkElm = content.find((item, index) => {
    item.index = index;
    return String(item.checked) === '1';
  });
  console.log('checkNumber:', checkElm);
  currentAnswerNumb.value = checkElm ? checkElm.index : -1; // 默认没有任何选题; // topics.value[0]?.number;
  appStore.setCurrTopicProcess(process); // 保存当前题号

  /// /console.log('topics.value=======>>>', mock?.data, topics.value);
};

const resized = () => {
  Taro.nextTick(() => {
    const query = Taro.createSelectorQuery();
    let bodyHeight = 0;
    query
      .select('.body-1')
      .boundingClientRect(res => {
        const info = Taro.getSystemInfoSync();
        const content_height = res.height + (env.toLowerCase() == 'web' ? 200 : 200);
        console.log('resized-:->:', bgRef, env, info, res, res.height, content_height, info.windowHeight);

        if (content_height + 150 > info.windowHeight) {
          isHeightOverFlow.value = true;
          contentHeight.value = content_height;
        } else {
          isHeightOverFlow.value = true;
          contentHeight.value = content_height;
        }
        bodyHeight = res.height;
        bgTopRef.value = `${bodyHeight - bgHeight.value}px`;
      })
      .exec();
  });
};

watch(
  () => appStore.getCurrTopicProcess,
  async (newVal, oldVal) => {
    if (newVal == oldVal || newVal == 0) {
      return;
    }
    console.log('watch====', newVal, oldVal);
    await init();
    resized();
  }
);

onMounted(async () => {
  /// await init();
  if (!isNaN(appStore.getCurrTopicProcess)) {
    const frist = Number(appStore.getCurrTopicProcess) + 1;
    // if (frist > total.value) {
    //   frist = total.value;
    // }
    appStore.setCurrTopicProcess(frist);
  }

  Taro.createSelectorQuery()
    .select('.bg')
    .boundingClientRect(bg => {
      bgHeight.value = bg.height;
    })
    .exec();

  resized();

  /// /自动答题测试用
  // setInterval(() => {
  //   currentAnswerNumb.value = 0;
  //   //
  //   console.log('currentAnswerNumb.value:', currentAnswerNumb.value);
  //   handleItem({ value: '1' }, 1);
  // }, 2000);
});
</script>

<style src="./index.scss" lang="scss" />
;
