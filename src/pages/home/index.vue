<template>
  <cg-navbar :title="titleRef" />
  <div class="home" :style="getStyle" :update="updateRef">
    <div class="bg" :style="{ height: getStyle.height }">
      <img :src="require('@/assets/images/home_bg.png')" />
    </div>
    <div class="pet-personality">
      <img :src="require('@/assets/images/pet-personality.png')" />
    </div>
    <div class="home-select">
      <img :src="require('@/assets/images/home-select.png')" />
    </div>
    <div class="go-cat" @click="onClickGoCat"></div>
    <div class="go-dog" @click="onClickGoDog"></div>
    <div
      v-if="reportListRef.length"
      class="group_10 flex-col"
      :style="{ paddingBottom: `${designToRealForPX(appStore.bottomArea.bottomH)}px` }"
    >
      <button class="button_1 flex-col" @click="onClickGoDetail">
        <span class="text_26">查看完整解读报告</span>
      </button>
    </div>
  </div>
</template>
<script setup lang="ts">
import { onMounted, ref, reactive, computed, watch } from 'vue';
import Taro, {
  getEnv,
  navigateBack,
  getWindowInfo,
  pxTransform,
  getSystemInfoSync,
  getCurrentInstance,
  showToast
} from '@tarojs/taro';
import { Button, Text } from '@tarojs/components';
import { fetchUserLoginApp, fetchProductInfo, fetchReportList, getToken } from '@/service';
import { useAppStore, useProductInfoStore } from '@/store';
import { getAnimaoPic, getAnimaoType, getURLParamsPID, designToRealForPX } from '@/utils/common';

const instance = getCurrentInstance();
const launchInfo = Taro.getLaunchOptionsSync();
// 输出当前页面的 URL 参数对象
console.log('instance.router.params:', launchInfo, launchInfo?.query?.pid, instance.router);

/** 设置页面属性 */
definePageConfig({
  navigationBarTitleText: '首页'
});

const reportListRef = ref([]);
const titleRef = ref('宠物性格测试');
const updateRef = ref(0);

const appStore = useAppStore();
const productInfoStore = useProductInfoStore();

const info = computed(() => productInfoStore.getInfo);

const theme = computed(() => {
  const pid = getURLParamsPID();
  const isDog = getAnimaoType(pid) == 'dog';
  return {
    color: isDog ? '#ff7237' : '#ffa000'
  };
});

const getPetInfo = () => {
  const pid = getURLParamsPID();
  const isDog = getAnimaoType(pid) == 'dog';
  return {
    title: isDog ? '尾巴卷得多紧,可能就表明狗狗有多焦虑' : '帮助领养人选择性格契合的猫咪',
    content: isDog
      ? `<span class="text_cont_1" >人有人格，狗有狗格。无论是什么品种的狗狗，即使同一个品种的狗狗，也有自己的个性。</span > <span class="text_cont_2" >狗格测试，采用专业的汪星人性格模型，帮助发现你的狗狗独特之处。</span > <span class="text_cont_3" >这是全网最系统的狗狗测评工具了，赶快测起来，分享你的发现。</span >`
      : `<span class="caption-2">今天咱们也找到了一份猫咪的性格测试问卷，来自ASPCA的Feline-ality™计划，最终将猫咪划分成了成了9种性格，一起来测试一下吧~</span> <span class="caption-3">该测试本身为领养时使用，帮助领养人选择性格契合的猫咪。</span><span class="title-2">如果猫咪已经与你生活一段时间，有些初见场景难以还原，请回忆或试想一下，当时的TA会怎么做吧~</span>`
  };
};

const onClickGoCat = () => {
  Taro.navigateTo({
    url: '/package/intro/index?pid=47'
  });
  // showToast({
  //   title: '敬请期待~',
  //   icon: 'none',
  //   duration: 1000
  // });
};
const onClickGoDog = () => {
  Taro.navigateTo({
    url: '/package/intro/index?pid=46'
  });
};

const onClickGoDetail = () => {
  Taro.navigateTo({
    url: '/package/list_report/index'
  });
};

// getPetInfo().content
const getConterInfo = () => {
  return getPetInfo().content;
};

const getPic = computed(() => {
  const pid = getURLParamsPID();
  return getAnimaoPic(pid);
});

const getStyle = computed(() => {
  const navHeight = designToRealForPX(appStore.getNavHeight);
  console.log('appStore.getNavHeight:1:::', appStore.getNavHeight, designToRealForPX(appStore.bottomArea.bottomH));
  return {
    paddingTop: `${pxTransform(appStore.getNavHeight)}`,
    height: `${Taro.getSystemInfoSync().windowHeight - navHeight}px` // `calc(100% - ${appStore.getNavHeight}px)`
  };
});

const state = reactive({
  isPopShow: false
});

const handleEntryToTest = () => {
  console.log('handleEntryToTest::');
  Taro.navigateTo({
    url: '/package/answer/index'
  });
};

const handlePurchaseToTest = () => {
  console.log('handlePurchaseToTest::');
  state.isPopShow = true;
};

const handlePass = () => {
  // Taro.switchTab({
  Taro.redirectTo({
    url: '/package/profile/index'
  });
};

const handleMask = () => {
  state.isPopShow = false;
};

const alertMsg = (msg: string) => {
  console.log('alertMsg=-=', msg);
  return new Promise((resolve, reject) => {
    Taro.showModal({
      title: 'debug',
      content: msg,
      showCancel: false,
      confirmText: '确定',
      success(res) {
        if (res.confirm) {
          console.log('用户点击确定');
          resolve(true);
        } else if (res.cancel) {
          console.log('用户点击取消');
          resolve(false);
        }
      }
    });
  });
};

const getReportList = async () => {
  const res = await fetchReportList();
  console.log('fetchReportList--', res);
  if (res?.code == 1) {
    reportListRef.value = res.data;
    productInfoStore.setReportList(res.data);
  } else {
    showToast({
      title: res.msg || '获取报告失败',
      icon: 'none'
    });
  }
};

const getUserInfo = () => {
  Taro.login({
    success: async res => {
      console.log('login', res.code);
      if (res.code) {
        await fetchUserLoginApp({
          code: res.code
        });
        getReportList();
        /// await entrance();
      }
    }
  });
};

// const entrance = async (isPay: boolean = false) => {
//   const pid = getURLParamsPID();
//   const result = await fetchProductInfo({
//     pid
//   });
//   console.log('result==>', result, result.data.status);
//   /// result.data.status = 'showpay'; // 测试
//   productInfoStore.setInfo(result.data);
//   const process = Number(result.data?.test_info?.process);
//   appStore.setCurrTopicProcess(process); // 第一次的进度值

//   const alert = true; // await alertMsg(info.value.status);
//   if (alert) {
//     if (info.value.status === 'showpay') {
//       // 支付环节
//       state.isPopShow = true;
//     } else if (info.value.status === 'showreport') {
//       // 评测作完，直接去评测结果页
//       Taro.redirectTo({
//         url: '/package/finally/index'
//       });
//     } else if (info.value.status === 'notdone') {
//       // 未完成，直接去测试页
//       const report_id = result.data?.report_id;
//       if (report_id?.length === 1) {
//         // 查看做题进度，哪一段做题未做完
//         console.log('当前report', report_id);
//       }
//       isPay && handlePass();
//     }
//   }
// };

const showAuthModal = () => {
  Taro.showModal({
    title: '授权提示',
    content: '需要获取您的用户信息',
    confirmText: '去授权',
    cancelText: '取消',
    success: res => {
      if (res.confirm) {
        // 用户点击确认，打开授权设置页面
        openSetting();
        // getUserProfile();
      }
    }
  });
};

const openSetting = () => {
  // Taro.openSetting：调起客户端小程序设置界面，返回用户设置的操作结果。设置界面只会出现小程序已经向用户请求过的权限。
  Taro.openSetting({
    success: res => {
      if (res.authSetting['scope.userInfo']) {
        console.log('用户授权成功，可以获取用户信息:', res);
        // 用户授权成功，可以获取用户信息
        getUserInfo();
      } else {
        // 用户拒绝授权，提示授权失败
        Taro.showToast({
          title: '授权失败',
          icon: 'none'
        });
      }
    }
  });
};

const getUserProfile = () => {
  Taro.getUserProfile({
    desc: '用户登录', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
    success: res => {
      console.log('声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写:', res);
    }
  });
};

onMounted(() => {
  console.log('onMounted');
  Taro.getSetting({
    success: res => {
      console.log('onMounted----', res);
      if (res.authSetting['scope.userInfo']) {
        // 用户已经授权过，可以直接获取用户信息
        getUserInfo();
      } else {
        // 用户未授权，需要弹出授权窗口
        showAuthModal();
      }
    }
  });
});

watch(
  () => appStore.getNavHeight,
  (newVal, oldVal) => {
    console.log('watch----', newVal);
    updateRef.value = 1;
  }
);
</script>

<style src="./index.scss" lang="scss" />
