<template>
	<cg-navbar title="基本信息" />
	<div class="profile" :style="getStyle">
		<div class="group" />
		<div class="group-1">
			<div class="header-1">
				<span class="summary">根据过去两周的状况，请您回答是否存在下列描述的状况及频率，请看清楚问题后选择符合您情况的选项。</span>
			</div>
			<div class="body-1">
				<div class="container-2">
					<div class="wrapper-1">
						<img class="icon-down" :src="require('@/assets/profile-images/img_0.png')" />
						<span class="caption">答题时需要注意以下事项</span>
					</div>
					<div class="wrapper-2">
						<img class="icon-circle" :src="require('@/assets/profile-images/img_1.png')" />
						<span class="caption-1">凭第一反应回答，不需要考虑太多</span>
					</div>
				</div>
			</div>
			<div class="footer">
				<div class="container-4">
					<img class="icon-circle-2" :src="require('@/assets/profile-images/img_2.png')" />
					<span class="title-1">题目没有好与坏，对与错之分</span>
				</div>
			</div>
		</div>
		<div class="group-3">
			<div class="header-2">
				<div class="container-7">
					<div class="wrapper-7">
						<div class="group-4">
							<div class="view">
								<div class="vertical-line" />
								<span class="title-2">被测评者基本信息</span>
							</div>
						</div>
						<span class="summary-1">基本信息很重要，测评结果的统计和计算与这些信息有关，请认真填写。</span>
					</div>
					<div class="wrapper-8">
						<span class="title-3">猫咪性别</span>
						<nut-cell>
							<nut-radio-group v-model="form.gender" direction="horizontal">
								<nut-radio label="1">男</nut-radio>
								<nut-radio label="2">女</nut-radio>
							</nut-radio-group>
						</nut-cell>
					</div>
					<div class="wrapper-9" @click="timeShow = true">
						<span class="caption-4">猫咪多大了</span>
						<nut-cell>
							<div class="game-wrapper" >
								<span class="game">{{ form.popupDesc }}</span>
								<img class="icon-right" :src="require('@/assets/profile-images/img_6.png')" />
							</div>
						</nut-cell>
					</div>
				</div>
			</div>
			<div class="body-2">
				<div class="title-wrapper"><span class="title-4">开始答题</span></div>
			</div>
		</div>
		<!-- <div class="footer-container">
			<img class="floor-bg" :src="require('@/assets/profile-images/img_7.png')" />
		</div> -->
	</div>
	<nut-popup position="bottom" v-model:visible="timeShow">
		<nut-date-picker v-model="currentDate" @confirm="popupConfirm" :is-show-chinese="true">
		</nut-date-picker>
	</nut-popup>
</template>
<script setup lang="ts">
import { useAppStore } from '@/store';
import { onMounted, ref, reactive, computed } from 'vue';
import { pxTransform } from '@tarojs/taro';
import { DatePicker } from '@nutui/nutui-taro';

const appStore = useAppStore();
const navHeight = computed(() => appStore.getNavHeight);
const getStyle = computed(() => {
	return {
		marginTop: `${pxTransform(appStore.getNavHeight)}`,
		height: `calc(100% - ${appStore.getNavHeight}px)`
	}
})
const timeShow = ref(false);
const form = reactive({
	gender: "1",
	popupDesc: "",
})
const currentDate = new Date();
const popupConfirm = ({ selectedValue, selectedOptions }) => {
	form.popupDesc = selectedOptions.map((val) => val.text).join('');
	timeShow.value = false;
};
onMounted(() => {
})
</script>

<style src="./index.css" />

