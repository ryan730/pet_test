<template>
  <nut-action-sheet v-model:visible="isShow" title="" close-abled @close="handleMask">
    <div class="cg-pop">
      <div class="block">
        <span class="title">支付</span>
        <div class="header">
          <div class="wrapper">
            <span class="buy">购买</span>
            <span class="title-1">{{ props.info.name }}</span>
          </div>
          <div class="price-wrapper">
            <span class="price-label">合计</span>
            <span class="price">¥{{ props.info.price }}</span>
          </div>
        </div>
        <div class="submain" />
        <div class="main">
          <div class="wrapper-1">
            <div class="caption-wrapper">
              <span class="caption">选择支付方式</span>
            </div>
            <div class="group-1">
              <img class="icon-chat" :src="require('@/assets/cg-images/wx.png')" />
              <!-- <div class="view"> -->
              <!-- <img class="icon-chat" :src="require('@/assets/cg-images/img_0.png')" /> -->
              <!-- <img class="icon-chat-1" :src="require('@/assets/cg-images/img_1.png')" /> -->
              <!-- </div> -->
              <span class="caption-1">微信支付</span>
            </div>
          </div>
          <div
            class="price-wrapper-1"
            :style="{
              backgroundColor: pauseRef ? 'gray' : props.theme.color,
              pointerEvents: pauseRef ? 'none' : 'auto'
            }"
            @click="handleToPayment"
          >
            <span class="price-1">确认支付 ¥{{ props.info.price }}</span>
          </div>
        </div>
      </div>
    </div>
    <!-- <div class="cg-pop">
			<div class="mask" @click="handleMask"></div>
			<div class="group">

			</div>
		</div>-->
  </nut-action-sheet>
</template>
<script setup lang="ts">
import { computed, defineEmits, ref } from 'vue';
import Taro from '@tarojs/taro';
import { fetchUserXorder, fetchCheckpay } from '@/service';
import { sleep } from '@/utils';

const emit = defineEmits(['onClickMask', 'onClickPass']);

interface Props {
  isShow?: boolean;
  info: any;
  theme: any;
}

interface reqForPay {
  timeStamp: string;
  nonceStr: string;
  package: string;
  signType: string;
  paySign: string;
}

const props = withDefaults(defineProps<Props>(), {
  isShow: false
});
const isShow = computed(() => props.isShow);

const handleMask = () => {
  console.log('handleMask', props);
  emit('onClickMask');
};

const showToast = (msg: string, duration: number = 2000) => {
  Taro.showToast({
    title: msg,
    icon: 'none',
    duration
  });
};

const pauseRef = ref(false);
const judgePayResult = async (order_id: number) => {
  console.log('juggle:', order_id);
  await sleep(3000);
  const res = await fetchCheckpay({
    order_id
  });

  console.log('查询结果:', res, res?.code == 1);
  if (res?.code == 1) {
    showToast('查询成功', 5000);
    emit('onClickPass', true); // entrance(ispay)
  } else {
    showToast(res?.msg || '订单查询失败!', 5000);
  }
};

const launchInfo = Taro.getLaunchOptionsSync();
const handleToPayment = async (req: any) => {
  const res = await fetchUserXorder({
    product_id: launchInfo?.query?.pid || 46
  });
  const js_params = res?.data?.js_params;
  const order_id = res?.data?.order_id;
  console.log('支付请求:', res, launchInfo?.query?.pid, js_params.appId);
  if (res?.code == 1) {
    pauseRef.value = true;
    Taro.requestPayment({
      timeStamp: js_params.appId,
      nonceStr: js_params.nonceStr,
      package: js_params.package,
      signType: js_params.signType, // 'MD5',
      paySign: js_params.paySign,
      timeStamp: js_params.timeStamp,
      success(res: any) {
        console.log('支付成功', res);
        /// showToast('支付成功');
        judgePayResult(order_id);
      },
      fail(res: any) {
        console.log('fail:', res.errMsg);
        showToast(`支付失败:${res.errMsg}`, 3000);
        sleep(3000).then(() => {
          pauseRef.value = false;
        });
      },
      complete(res: any) {
        console.log('complete:', res.errMsg);
        emit('onClickMask');
      }
    });
  }
};
</script>

<style src="./index.css" />
