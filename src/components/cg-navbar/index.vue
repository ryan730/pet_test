<template>
  <div class="cg-nav">
    <div class="header">
      <div class="statusbar" :style="{ height: pxTransform(statusBarHeight) }"></div>
      <div class="wrapper" :style="{ height: pxTransform(navBarHeight) }">
        <navigator class="close-con" target="miniProgram" open-type="exit">
          <img class="icon-close" :src="require('@/assets/images/img_3.png')" />
        </navigator>
        <span class="caption">{{ props.title }}</span>
        <div class="group-1"></div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { getEnv, navigateBack, getWindowInfo, pxTransform } from '@tarojs/taro';
import { useAppStore } from '@/store';

const appStore = useAppStore();

interface Props {
  title?: string;
}

const props = withDefaults(defineProps<Props>(), {
  title: ' '
});

const getMenuCapsule = (isweb: boolean) => {
  if (!isweb && wx) {
    const sysinfo = wx.getSystemInfoSync(); // 获取设备系统对象
    const statusBarHeight = sysinfo.statusBarHeight; // 获取状态栏高度
    const menuButtonObject = wx.getMenuButtonBoundingClientRect(); // 获取胶囊对象
    const menuBottonHeight = menuButtonObject.height; // 获取胶囊顶部高度
    const menuBottonTop = menuButtonObject.top; // 获取胶囊距离顶部的高度
    return {
      height: menuBottonHeight + (menuBottonTop - statusBarHeight) * 2
    };
  }
  return {
    height: 40
  };
};

const env = getEnv();
const menuCapsule = getMenuCapsule(env === 'WEB');

const windowInfo = env === 'WEB' ? { statusBarHeight: 0 } : getWindowInfo();

const statusBarHeight = windowInfo.statusBarHeight * 2 || 0;

const navBarHeight = menuCapsule.height * 2;
/** 安全区高度 + navbar高度 */
const height = statusBarHeight + navBarHeight;
console.log('安全区高度 + navbar高度:', statusBarHeight, menuCapsule, navBarHeight, windowInfo);

appStore.setNavHeight(height);
appStore.setBottomArea({
  ...windowInfo.safeArea,
  bottomH: windowInfo.safeArea.bottom - windowInfo.safeArea.height
});
</script>
<style src="./index.css" />
