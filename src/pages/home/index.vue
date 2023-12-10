<template>
  <cg-navbar :title="info.name" />
  <!-- <Button size="default"  type="warn" open-type="getPhoneNumber" @getphonenumber="getTel">
		<Text class="get-phone-text">微信一键登录</Text>
	</Button> -->

  <div class="page" :style="getStyle">
    <div class="block">
      <div class="body">
        <div class="bg-image" />
      </div>
      <div class="submain">
        <div class="wrapper-2">
          <span class="title">{{ info.name }}</span>
          <span class="title-1">帮助领养人选择性格契合的猫咪</span>
          <div class="group-3">
            <div class="view-1">
              <img class="icon-text" :src="require('@/assets/images/img_23.png')" />
              <span class="label">共88题</span>
            </div>
            <div class="view-2">
              <img class="icon-time" :src="require('@/assets/images/img_24.png')" />
              <span class="tag">约需25分钟</span>
            </div>
          </div>
        </div>
        <div class="wrapper-3">
          <div class="empty" />
          <div class="price-wrapper">
            <span class="price">¥{{ info.price }}</span>
            <div class="price-wrapper-1">
              <span class="price-1">¥{{ info.price_show }}</span>
              <div class="empty-1" />
            </div>
          </div>
        </div>
      </div>
      <div class="main">
        <div class="wrapper-4">
          <div class="group-4">
            <img class="icon-user-group" :src="require('@/assets/images/img_25.png')" />
            <span class="caption-1">测评简介</span>
          </div>
          <span class="summary">
            今天咱们也找到了一份猫咪的性格测试问卷，来自ASPCA的Feline-ality™计划，最终将猫咪划分
          </span>
          <span class="caption-2">成了9种性格，一起来测试一下吧~</span>
          <span class="caption-3">该测试本身为领养时使用，帮助领养人选择性格</span>
          <div class="caption-wrapper">
            <span class="caption-4">契合的猫咪。</span>
          </div>
          <span class="title-2">如果猫咪已经与你生活一段时间，有些初见场景</span>
          <span class="title-3">难以还原，请回忆或试想一下，当时的TA会怎么做吧~</span>
        </div>
        <div v-if="info?.status == 'notdone'" class="wrapper-5" @click="handleEntryToTest">
          <div class="title-wrapper"><span class="title-4">立即测试</span></div>
          <img class="picture" :src="require('@/assets/images/img_26.png')" />
        </div>
        <div v-if="info?.status == 'showpay'" class="wrapper-5" @click="handlePurchaseToTest">
          <div class="title-wrapper"><span class="title-4">立即购买</span></div>
          <img class="picture" :src="require('@/assets/images/img_26.png')" />
        </div>
      </div>
    </div>
  </div>
  <cg-pop-pay :is-show="state.isPopShow" :info="info" @onClickMask="handleMask" @onClickPass="handlePass" />
</template>
<script setup lang="ts">
import { onMounted, ref, reactive, computed } from 'vue';
import Taro, { getEnv, navigateBack, getWindowInfo, pxTransform, getSystemInfoSync } from '@tarojs/taro';
import { Button, Text } from '@tarojs/components';
import { fetchUserLoginApp, fetchProductInfo, getToken } from '@/service';
import { useAppStore, useProductInfoStore } from '@/store';

/** 设置页面属性 */
definePageConfig({
  navigationBarTitleText: '首页'
});

const appStore = useAppStore();
const productInfoStore = useProductInfoStore();

const info = computed(() => productInfoStore.getInfo);

const getStyle = computed(() => {
  return {
    marginTop: `${pxTransform(appStore.getNavHeight)}`,
    height: `calc(100% - ${appStore.getNavHeight}px)`
  };
});

const state = reactive({
  isPopShow: false
});

const handleEntryToTest = () => {
  console.log('handleEntryToTest::');
  Taro.navigateTo({
    url: '/pages/answer/index'
  });
};

const handlePurchaseToTest = () => {
  console.log('handlePurchaseToTest::');
  state.isPopShow = true;
};

const handlePass = () => {
  // Taro.switchTab({
  Taro.navigateTo({
    url: '/pages/profile/index'
  });
};

const handleMask = () => {
  state.isPopShow = false;
};

//     // 	Taro.showModal({
//     // 		title: '警告',
//     // 		content: '您点击了拒绝授权，将无法进入小程序，请授权之后再进入!!!',
//     // 		showCancel: false,
//     // 		confirmText: '返回授权',
//     // 		success: function (res) {
//     // 			if (res.confirm) {
//     // 				console.log('用户点击了“返回授权”');
//     // 			}
//     // 		}
//     // 	});
//   }

const getUserInfo = () => {
  Taro.login({
    success: async res => {
      if (res.code) {
        console.log('login', res.code);
        await fetchUserLoginApp({
          code: res.code
        });
        const result = await fetchProductInfo({
          pid: 46
        });
        console.log('result==', result);
        result.data.status = 'showreport'; // 测试
        productInfoStore.setInfo(result.data);
        const process = Number(result.data?.test_info?.process);
        appStore.setCurrTopicProcess(process); // 第一次的进度值

        if (info.value.status === 'showpay') {
          // 支付环节
          state.isPopShow = true;
        } else if (info.value.status === 'showreport') {
          // 评测作完，直接去评测结果页
          Taro.navigateTo({
            url: '/pages/finally/index'
            // url: '/pages/simply_report/index'
          });
        } else if (info.value.status === 'notdone') {
          // 未完成，直接去测试页
          const report_id = result.data?.report_id;
          if (report_id?.length === 1) {
            // 查看做题进度，哪一段做题未做完
            console.log('哪一段做题未做完', report_id);
          }
        }
      }
    }
  });
};

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
</script>

<style src="./index.scss" lang="scss" />
