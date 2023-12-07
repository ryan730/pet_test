<template>
  <cg-navbar title="恭喜完成" />
  <div class="finally" :style="getStyle">
    <div class="block">
      <div class="header">
        <span class="summary">
          根据过去两周的状况，请您回答是否存在下列描述的状况及频率，请看清楚问题后选择符合您情况的选项。
        </span>
      </div>
      <div v-if="true" class="body">
        <div class="wrapper">
          <div class="group">
            <img class="icon-down" src="./images/img_0.png" />
            <span class="caption">答题时需要注意以下事项</span>
          </div>
          <div class="group-1">
            <img class="icon-circle" src="./images/img_1.png" />
            <span v-if="true" class="caption-1">凭第一反应回答，不需要考虑太多</span>
          </div>
        </div>
        <div class="wrapper-1">
          <div class="group-2">
            <img class="picture" src="./images/img_2.png" />
            <img class="icon-circle-1" src="./images/img_3.png" />
            <img class="icon-line" src="./images/img_4.png" />
          </div>
        </div>
        <img class="dot" src="./images/img_5.png" />
      </div>
      <div class="footer">
        <div class="wrapper-2">
          <img class="icon-circle-2" src="./images/img_6.png" />
          <span class="title">题目没有好与坏，对与错之分</span>
        </div>
      </div>
    </div>
    <div class="block-1">
      <div class="header-1">
        <div class="wrapper-5">
          <div class="group-6"><span class="num">7</span></div>
        </div>
      </div>
      <div class="body-1">
        <div class="wrapper-6">
          <!-- <img class="icon-like" src="./images/img_7.png" />
          <img class="icon-like-1" src="./images/img_8.png" />
          <img class="icon-line-2" src="./images/img_9.png" />
          <img class="icon-text-1" src="./images/img_10.png" />
          <img class="icon-piece-2" src="./images/img_11.png" />
          <img class="icon-1" src="./images/img_12.png" />
          <img class="icon-play" src="./images/img_13.png" /> -->
        </div>
        <span class="title-1">恭喜您完成测试</span>
        <div class="title-wrapper">
          <span class="title-2">查看我的测评结果</span>
        </div>
        <span class="caption-2">您今后可以在【我的测评】中找到您测试过的报告</span>
        <div class="wrapper-7"><span class="logout">保存并退出</span></div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { onMounted, ref, reactive, computed, watch } from 'vue';
import Taro, { getEnv, showToast, pxTransform } from '@tarojs/taro';
import { Cell, CellGroup } from '@nutui/nutui-taro';
import { IconFont } from '@nutui/icons-vue-taro';
import { fetchTestTopic } from '@/service';
import { useAppStore } from '@/store';
import { debounce } from '@/utils';
import mock from './mock.js';

const topics = ref([]);
const number = ref(0);
const total = ref(0);
const topic = ref({});
const currentNumb = ref(0);

const appStore = useAppStore();

const count = computed(() => appStore.getCurrTopicNumber);

const isHeightOverFlow = ref(false);

const contentHeight = ref(0);

const env = getEnv();
/// const info = Taro.getSystemInfoSync();

const getStyle = computed(() => {
  const val = {
    marginTop: `${pxTransform(appStore.getNavHeight)}`,
    height: `${contentHeight.value}px` // isHeightOverFlow.value ? `${contentHeight.value + appStore.getNavHeight}px` : `100%` // `calc(100% - ${appStore.getNavHeight}px)`
  };
  console.log('getStyle:::', isHeightOverFlow.value, contentHeight.value, val);
  return val;
});

const handlePrev = () => {
  let currTopicNumber = appStore.getCurrTopicNumber;
  // eslint-disable-next-line no-plusplus
  currTopicNumber--;
  if (currTopicNumber <= 1) {
    currTopicNumber = 1;
  }
  appStore.setCurrTopicNumber(currTopicNumber);
  console.log('handlePrev:', currTopicNumber, appStore.getCurrTopicNumber);
};

const handleNext = () => {
  if (!(currentNumb.value > 0)) {
    Taro.showToast({
      title: '选择一个选项',
      icon: 'none',
      duration: 2000
    });
    return;
  }
  let currTopicNumber = appStore.getCurrTopicNumber;
  // eslint-disable-next-line no-plusplus
  currTopicNumber++;
  if (currTopicNumber > total.value) {
    currTopicNumber = total.value;
    Taro.showToast({
      title: '已经是最后一题了',
      icon: 'none',
      duration: 2000
    });
  }
  appStore.setCurrTopicNumber(currTopicNumber);
  console.log('handleNext:', currTopicNumber, appStore.getCurrTopicNumber);
};

const getActive = (item: any) => {
  if (item.value === currentNumb.value) {
    return {
      'background-color': 'rgba(249, 216, 110, 1)'
    };
  }
};

const handleItem = (item: any) => {
  /// debounce(() => {
  if (item.value == currentNumb.value) {
    return;
  }
  currentNumb.value = item.value;
  setTimeout(() => {
    handleNext();
  }, 1500);
  /// }, 1600)
};

const init = async () => {
  let data = null;
  try {
    data = await fetchTestTopic({
      utid: '',
      test_id: '',
      cur: '46'
    });
  } catch (e) {
    console.log(e);
  }
  topics.value = mock?.data?.topics;
  total.value = 3; // mock?.data?.total;
  // number.value = topics.value[0].number;
  number.value = appStore.getCurrTopicNumber;
  topic.value = topics.value[parseInt(Math.random() * 3)];
  currentNumb.value = 0; // topics.value[0]?.number;
  console.log('topics.value=======>>>', mock?.data, topics.value);
};

const resized = () => {
  setTimeout(() => {
    const query = Taro.createSelectorQuery();
    query
      .select('.finally')
      .boundingClientRect(res => {
        const info = Taro.getSystemInfoSync();
        contentHeight.value = res.height;
        // const content_height = res.height + (env.toLowerCase() == 'web' ? 200 : 200);
        // console.log('resized-:->:', env, info, res, res.height, content_height, info.windowHeight);

        // if (content_height + 150 > info.windowHeight) {
        //   isHeightOverFlow.value = true;
        //   contentHeight.value = content_height;
        // } else {
        //   isHeightOverFlow.value = true;
        //   contentHeight.value = content_height;
        // }
      })
      .exec();
  }, 200);
};

watch(
  () => appStore.getCurrTopicNumber,
  newVal => {
    init();
    resized();
    console.log('watch:', newVal);
  }
);

onMounted(async () => {
  init();
  resized();
});
</script>

<style src="./index.css" />
;
