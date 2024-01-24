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
          <span class="caption-1">
            <img class="light" :src="require('../../assets/images/light.png')" />
            答题时需要注意以下事项
          </span>
          <span class="caption-2">
            <img class="icon-circle" :src="require('@/assets/profile-images/img_1.png')" />
            凭第一反应回答，不需要考虑太多
          </span>
          <span class="caption-3">
            <img class="icon-circle" :src="require('@/assets/profile-images/img_1.png')" />
            题目没有好与坏，对与错之分
          </span>
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
            <span class="button">{{ number }}</span>
          </div>
        </div>
      </div>
      <div v-if="sectionRef == 1" class="group_4 flex-row justify-between lista">
        <div class="box_6 flex-col">
          <span class="text_7">{{ topic?.title }}</span>
          <!-- <img
            class="image_4"
            referrerpolicy="no-referrer"
            src="https://lanhu.oss-cn-beijing.aliyuncs.com/SketchPng42da64e2f3e857de32980efc554abba363fc6a0d054bae5978f5b1f749f29b5a"
          /> -->
        </div>
        <div class="box_7 flex-col">
          <div
            v-for="(item, index) in topic?.content"
            class="text-wrapper_1 flex-col"
            :style="getActive(item, index)"
            @click="handleItem(item, index)"
          >
            <span class="text_8">{{ item?.text }}</span>
          </div>
        </div>
      </div>
      <div v-if="sectionRef == 0" class="body-1 lista">
        <div class="title-wrapper" :style="{ backgroundColor: '#FFE9A4' }">
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
        <div class="wrapper-6">
          <!-- <img class="item" src="./images/img_9.png" /> -->
        </div>
        <!-- <div class="body-bg">
          <img ref="bgRef" class="bg" :style="{ top: bgTopRef }" :src="require('@/assets/images/bg.png')" />
        </div> -->
      </div>
      <div :style="{ pointerEvents: btnHiddenRef ? 'auto' : 'none' }" class="btn-next-prev">
        <nut-cell>
          <div v-show="appStore.getCurrTopicProcess > 1" class="prev" @click="handlePrev">上一题</div>
        </nut-cell>
        <nut-cell>
          <div v-show="appStore.getCurrTopicProcess < total" class="next" @click="handleNext">下一题</div>
        </nut-cell>
      </div>
    </div>
  </div>
  <div class="footer-container" :style="{ pointerEvents: btnHiddenRef ? 'auto' : 'none' }">
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
import { fetchTestTopic, fetchUserTopic, fetchProductInfo, fetchProductStatus } from '@/service';
import { useAppStore, useProductInfoStore } from '@/store';
import { debounce, sleep } from '@/utils';
import { getAnimaoType, getAnimaoPic, getURLParamsPID, designToRealForPX } from '@/utils/common';
import mock from './mock.js';

const topics = ref([]);
const total = ref(0);
const topic = ref({});
const answeRef = ref('');
const bgTopRef = ref(0);
const bgRef = ref(null);
const bgHeight = ref(0);
const productInfoStore = useProductInfoStore();
const sectionRef = ref(0); // 第几段 0/1

/// const number = computed(() => Number(appStore.getCurrTopicProcess));
const number = computed(() => {
  const sbase = productInfoStore?.getInfo?.sbase;
  const stotal = productInfoStore?.getInfo?.stotal;
  const answerId = productInfoStore?.getInfo?.test_info?.test_id;
  // return info?.sbase;
  console.log('sbase:::', sbase);
  console.log('stotal:::', stotal);
  console.log('process:::', answerId, appStore.getCurrTopicProcess);
  console.log('total:::', total.value);

  if (answerId == 47) {
    sectionRef.value = 1;
  } else if (answerId == 46) {
    sectionRef.value = 0;
  }
  let percent = Number(appStore.getCurrTopicProcess) + Number(sbase);
  if (percent >= Number(stotal)) {
    percent = Number(stotal);
  }

  return `${percent}/${Number(stotal)}`;
});
const currentAnswerNumb = ref(-1); // 当前答题选项,-1表示未选择
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

const info = computed(() => productInfoStore.getInfo);

const appStore = useAppStore();

const isHeightOverFlow = ref(false);

const contentHeight = ref(0);

const btnHiddenRef = ref(true);

const env = getEnv();
/// const info = Taro.getSystemInfoSync();

// const getStyle = computed(() => {
//   const val = {
//     marginTop: `${pxTransform(appStore.getNavHeight)}`,
//     height: isHeightOverFlow.value ? `${contentHeight.value + appStore.getNavHeight}px` : `100%` // `calc(100% - ${appStore.getNavHeight}px)`
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

// 检查是否做第二套题
const continueNextSection = async () => {
  const pid = getURLParamsPID();
  const result = await fetchProductStatus({
    pid
  });
  productInfoStore.setInfo(result.data);
  const test_info = result.data?.test_info;
  const status = result.data?.status;
  const report_id = result.data?.report_id;
  if (status == 'notdone' && test_info) {
    console.log('continueNextSection::', result.data);
    Taro.showToast({
      title: '开始第二段答题',
      icon: 'none',
      duration: 2000
    });
    /// sectionRef.value = 1;
    const process = test_info?.process == 0 ? 1 : Number(test_info?.process); // 第一次的进度0转成1
    appStore.setCurrTopicProcess(process); // 第二次的进度值
    await init();
  } else if (status == 'showreport' || !test_info || test_info?.length == 0) {
    Taro.showToast({
      title: '答题完成,正在去往结果页...',
      icon: 'none',
      duration: 1000
    });
    productInfoStore.setReport({
      report_id, // ['600', '601']
      score: 0
    });
    console.log('test_info:', report_id, test_info);
    setTimeout(() => {
      Taro.redirectTo({
        url: '/package/finally/index'
      });
    }, 1000);
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

const handleNext = async () => {
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
  console.log('sendAnswer-req:::', currentAnswerNumb.value);
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
  console.log('sendAnswer-res::', res);
  return res;
};

const handleItem = debounce(async (item: any, index: number) => {
  console.log('handleItem:', item, index, currentAnswerNumb.value);
  /// debounce(() => {
  if (index === currentAnswerNumb.value) {
    return;
  }
  currentAnswerNumb.value = index;
  answeRef.value = item.value;
  let send = null;
  btnHiddenRef.value = false;
  try {
    send = await sendAnswer();
    console.log('sendAnswer--1----::', send, send?.code);
  } catch (e) {
    console.log('sendAnswer--2----::', e);
    showToast({
      title: '提交失败，请重试！',
      icon: 'none',
      duration: 2000
    });
  }

  if (send?.code == 1) {
    await sleep(1500);
    handleNext();
  } else {
    currentAnswerNumb.value = -1;
  }
  btnHiddenRef.value = true;
}, 500);

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
  /// res = mock;

  const process = res?.data?.process; // 如果是0,强制跳到1
  const ntotal = res?.data?.total; // 如果是0,强制跳到1
  console.log('data=======>>>', res?.data, process, ntotal);
  if (process > ntotal) {
    console.log('超出合法范围!');
    /// /return;
  }

  topics.value = res?.data?.topics; // mock?.data?.topics;
  total.value = res?.data?.total; // 3; // mock?.data?.total;
  topic.value = topics.value[0]; // topics.value[parseInt(Math.random() * 3)];

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
      .select('.lista')
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
  if (!isNaN(appStore.getCurrTopicProcess)) {
    let frist = Number(appStore.getCurrTopicProcess) + 1;
    const total = info.value?.test_info?.total;
    console.log('初始化的请求', frist, total);
    if (frist >= total) {
      frist = total;
      await init();
      return;
    }
    appStore.setCurrTopicProcess(frist);
  }

  // Taro.createSelectorQuery()
  //   .select('.bg')
  //   .boundingClientRect(bg => {
  //     bgHeight.value = bg.height;
  //   })
  //   .exec();

  resized();

  /// /自动答题测试用
  // setInterval(() => {
  //   if (appStore.getCurrTopicProcess > 70) {
  //     return;
  //   }
  //   currentAnswerNumb.value = 0;
  //   //
  //   console.log('currentAnswerNumb.value:', appStore.getCurrTopicProcess, currentAnswerNumb.value);
  //   handleItem({ value: '1' }, 1);
  // }, 2000);
});
</script>

<style src="./index.scss" lang="scss" />
;
