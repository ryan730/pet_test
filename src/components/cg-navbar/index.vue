<template>
	<div class="cg-nav">
		<div class="header">
			<div class="statusbar" :style="{ height: pxTransform(statusBarHeight) }">
			</div>
			<div class="wrapper" :style="{ height: pxTransform(navBarHeight) }">
				<navigator class="close-con" target="miniProgram" open-type="exit">
					<img class="icon-close" :src="require('@/assets/images/img_3.png')" />
				</navigator>
				<span class="caption">猫咪“MBTI”测试</span>
				<div class="group-1">
				</div>
			</div>
		</div>
	</div>
</template>
<script setup lang="ts">
import { getEnv, navigateBack, getWindowInfo, pxTransform } from '@tarojs/taro';
import { useAppStore } from '@/store';

const appStore = useAppStore();

const getMenuCapsule = (isweb: boolean) => {
	if (!isweb && wx) {
		var sysinfo = wx.getSystemInfoSync(); // 获取设备系统对象
		let statusBarHeight = sysinfo.statusBarHeight; // 获取状态栏高度
		let menuButtonObject = wx.getMenuButtonBoundingClientRect(); //获取胶囊对象
		let menuBottonHeight = menuButtonObject.height; //获取胶囊顶部高度
		let menuBottonTop = menuButtonObject.top; // 获取胶囊距离顶部的高度
		return {
			height: menuBottonHeight + (menuBottonTop - statusBarHeight) * 2
		}
	}
	return {
		height: 40
	}
}

const env = getEnv();
const menuCapsule = getMenuCapsule(env === 'WEB');

const windowInfo = env === 'WEB' ? { statusBarHeight: 0 } : getWindowInfo();

const statusBarHeight = windowInfo.statusBarHeight * 2 || 0;

const navBarHeight = menuCapsule.height * 2;
/** 安全区高度 + navbar高度 */
const height = statusBarHeight + navBarHeight;
console.log('安全区高度 + navbar高度:', statusBarHeight, menuCapsule, navBarHeight, windowInfo);

appStore.setNavHeight(height);
</script>
<style src="./index.css" />
