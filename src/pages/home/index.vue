<template>
  <cg-navbar title="首页" />
  <!-- <Button size="default"  type="warn" open-type="getPhoneNumber" @getphonenumber="getTel">
		<Text class="get-phone-text">微信一键登录</Text>
	</Button> -->

  <div class="page" :style="getStyle">
    <div class="block">
      <div class="body">
        <img class="layer" :src="require('@/assets/images/img_7.png')" />
        <img class="icon-image" :src="require('@/assets/images/img_8.png')" />
        <img class="icon-piece" :src="require('@/assets/images/img_9.png')" />
        <img class="icon-piece-1" :src="require('@/assets/images/img_10.png')" />
        <img class="icon" :src="require('@/assets/images/img_11.png')" />
        <img class="icon-1" :src="require('@/assets/images/img_12.png')" />
        <img class="action-bg" :src="require('@/assets/images/img_13.png')" />
        <img class="icon-2" :src="require('@/assets/images/img_14.png')" />
        <img class="button-bg" :src="require('@/assets/images/img_15.png')" />
        <img class="bg" :src="require('@/assets/images/img_16.png')" />
        <img class="icon-guard" :src="require('@/assets/images/img_17.png')" />
      </div>
      <div class="submain">
        <div class="wrapper-2">
          <span class="title">猫咪“MBTI”测试</span>
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
            <span class="price">¥6.9</span>
            <div class="price-wrapper-1">
              <span class="price-1">¥75</span>
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
        <div class="wrapper-5" @click="handleEntryToTest">
          <div class="title-wrapper"><span class="title-4">立即测试</span></div>
          <img class="picture" :src="require('@/assets/images/img_26.png')" />
        </div>
      </div>
    </div>
  </div>
  <cg-pop-pay :is-show="state.isPopShow" @onClickMask="handleMask" @onClickPass="handlePass" />
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

// 授权登录
const getTel = (e: { detail: { iv: any; encryptedData: any; errMsg: string } }) => {
  console.log('getTel======', e.detail);
  const { encryptedData, iv } = e.detail;
  if (e.detail.errMsg === 'getPhoneNumber:ok') {
    Taro.showLoading({ title: '登录中' });
    Taro.login({
      // 这个code也可以在useEffect方法上写，怎么来都可以，最下面我会附上代码
      success: res => {
        if (res.code) {
          console.log('code', res.code);
          // Taro.request({
          // 	url: ''//这里写自己的接口地址,
          //     method: ''//接口类型，大写！
          //     data: { //参数
          // 		encryptedData: encryptedData,
          // 		Iv: iv,
          // 		SessionKey: res.code, //code：手机号获取凭证：动态令牌，可通过动态令牌换取用户手机号
          // 	},
          // 	success: (res) => {
          // 		console.log("res", res)
          // 		const { body, businesscode } = res.data;
          // 		if (businesscode == 1) {
          // 			const { token, user } = body;
          // 			//设置token
          // 			Taro.setStorageSync("token", "Bearer " + token);
          // 			Taro.setStorageSync("user", user);
          // 			Taro.switchTab({ url: "成功后你的url" });
          // 		}
          // 		else {
          // 			showToast({
          // 				title: '错误',
          // 				icon: "none",
          // 			});
          // 		}
          // 	}
          // })
        }
      }
    });
    //   else {
    // 	Taro.showModal({
    // 		title: '警告',
    // 		content: '您点击了拒绝授权，将无法进入小程序，请授权之后再进入!!!',
    // 		showCancel: false,
    // 		confirmText: '返回授权',
    // 		success: function (res) {
    // 			if (res.confirm) {
    // 				console.log('用户点击了“返回授权”');
    // 			}
    // 		}
    // 	});
  }
};

const getUserInfo = () => {
  Taro.login({
    success: async res => {
      if (res.code) {
        // Taro.getUserInfo({
        //   success: userInfoRes => {
        //     const { encryptedData, iv } = userInfoRes;
        //     // 在这里将 encryptedData 和 iv 传给后端解密获取手机号
        //     console.log('在这里将 encryptedData 和 iv 传给后端解密获取手机号:', userInfoRes, res);
        //     Taro.setStorageSync('openId', ''); // 保存openId
        //   }
        // });
        console.log('login', res.code);
        await fetchUserLoginApp({
          code: res.code
        });
        const result = await fetchProductInfo({
          pid: 46
        });
        console.log('result==', result);
        productInfoStore.setInfo(result.data);

        setTimeout(() => {
          console.log('ttttt', productInfoStore.getInfo);
        }, 3000);
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

<style src="./index.css" />
