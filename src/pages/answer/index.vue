<template>
	<cg-navbar title="答题" />
	<div class="answer" :style="getStyle">
		<div class="block">
			<div class="header">
				<span class="summary">根据过去两周的状况，请您回答是否存在下列描述的状况及频率，请看清楚问题后选择符合您情况的选项。</span>
			</div>
			<div class="body">
				<div class="wrapper">
					<div class="group">
						<!-- <img class="icon-down" src="./images/img_0.png" /> -->
						<span class="caption">答题时需要注意以下事项</span>
					</div>
					<div class="group-1">
						<!-- <img class="icon-circle" src="./images/img_1.png" /> -->
						<span class="caption-1">凭第一反应回答，不需要考虑太多</span>
					</div>
				</div>
				<div class="wrapper-1">
					<div class="group-2">
						<!-- <img class="image" src="./images/img_2.png" /> -->
					</div>
					<!-- <img class="icon-text" src="./images/img_3.png" /> -->
				</div>
				<!-- <img class="icon-line-1" src="./images/img_4.png" />
				<img class="dot" src="./images/img_5.png" />
				<img class="dot-1" src="./images/img_6.png" />
				<img class="dot-2" src="./images/img_7.png" /> -->
			</div>
			<div class="footer">
				<div class="wrapper-2">
					<!-- <img class="icon-circle-2" src="./images/img_8.png" /> -->
					<span class="title">题目没有好与坏，对与错之分</span>
				</div>
			</div>
		</div>
		<div class="block-1">
			<div class="header-1">
				<div class="wrapper-4" />
				<div class="wrapper-5">
					<div class="button-wrapper"><span class="button">{{ number }}/{{ total }}</span></div>
				</div>
			</div>
			<div class="body-1">
				<div class="title-wrapper">
					<span class="title-1">{{ topic?.title }}</span>
				</div>
				<div class="btn-wrapper-item" v-for="(item, index) in topic?.content" :style="getActive(item)"
					@click="handleItem(item)">
					<span class="btn">{{ item.text }}</span>
				</div>
				<div class="btn-next-prev">
					<div class="prev" @click="handlePrev" v-show="appStore.getCurrTopicNumber > 1">上一题</div>
					<div class="next" @click="handleNext" v-show="appStore.getCurrTopicNumber <= total - 1">下一题</div>
				</div>
				<div class="wrapper-6">
					<!-- <img class="item" src="./images/img_9.png" /> -->
				</div>
			</div>
		</div>
	</div>
	<div class="footer-container">
		<IconFont @click="handlePrev" v-show="appStore.getCurrTopicNumber > 1" name="rect-left" size="24"></IconFont>
		<IconFont @click="handleNext"  v-show="appStore.getCurrTopicNumber <= total - 1" name="rect-right" size="24"></IconFont>
	</div>
</template>
<script setup lang="ts">
import { useAppStore } from '@/store';
import { onMounted, ref, reactive, computed, watch } from 'vue';
import { showToast } from '@tarojs/taro';
import { pxTransform } from '@tarojs/taro';
import Taro from '@tarojs/taro';
import { fetchTestTopic } from '@/service';
import { debounce } from '@/utils';
import { IconFont } from '@nutui/icons-vue-taro';
import mock from './mock.js';

const topics = ref([]);
const number = ref(0);
const total = ref(0);
const topic = ref({});
const currentNumb = ref(null);

const appStore = useAppStore();

const count = computed(() => appStore.getCurrTopicNumber);

const getStyle = computed(() => {
	return {
		marginTop: `${pxTransform(appStore.getNavHeight)}`,
		height: `calc(100% - ${appStore.getNavHeight}px)`
	}
})

const handlePrev = () => {
	let currTopicNumber = appStore.getCurrTopicNumber;
	currTopicNumber--;
	if (currTopicNumber <= 1) {
		currTopicNumber = 1;
	}
	appStore.setCurrTopicNumber(currTopicNumber);
	console.log('handlePrev:', currTopicNumber, appStore.getCurrTopicNumber);
}

const handleNext = () => {
	if (!(currentNumb.value > 0)) {
		Taro.showToast({
			title: '选择一个选项',
			// icon: 'success',
			duration: 2000
		});
		return;
	}
	let currTopicNumber = appStore.getCurrTopicNumber;
	currTopicNumber++;
	if (currTopicNumber >= total.value) {
		currTopicNumber = total.value;
	}
	appStore.setCurrTopicNumber(currTopicNumber);
	console.log('handleNext:', currTopicNumber, appStore.getCurrTopicNumber);
}

const getActive = (item: any) => {
	if (item.value == currentNumb.value) {
		return {
			'background-color': 'rgba(249, 216, 110, 1)'
		}
	}
}

const handleItem = (item: any) => {
	///debounce(() => {
	if (item.value == currentNumb.value) {
		return;
	}
	currentNumb.value = item.value;
	setTimeout(() => {
		handleNext();
	}, 1500);
	///}, 1600)
}

const init = async () => {
	let data = null;
	try {
		data = await fetchTestTopic({
			utid: '',
			test_id: '',
			cur: '46'
		})
	} catch (e) {
		console.log(e);
	}
	topics.value = mock?.data?.topics;
	total.value = mock?.data?.total;
	//number.value = topics.value[0].number;
	number.value = appStore.getCurrTopicNumber;
	topic.value = topics.value[0];
	currentNumb.value = 0;//topics.value[0]?.number;
	console.log('topics.value=======>>>', mock?.data, topics.value);
}

watch(() => appStore.getCurrTopicNumber, (newVal) => {
	console.log('watch:', newVal);
	init();
})

onMounted(async () => {
	init();
})
</script>

<style src="./index.css" />
;
