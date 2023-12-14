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
          <div class="price-wrapper-1" :style="{ backgroundColor: props.theme.color }" @click="handleToPayment">
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
import { computed, defineEmits } from 'vue';
import Taro from '@tarojs/taro';

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

const handleToPayment = (req: any) => {
  emit('onClickPass');
  return;
  Taro.request({
    url: '', // 这里是后台给你的接口，找你们后台要
    method: 'POST',
    header: {
      'content-type': 'application/x-www-form-urlencoded'
    },
    data: {
      openId: Taro.setStorageSync('openId'),
      orderId: '',
      ...req
    },
    success: res => {
      console.log(res.data.data.appid);
      console.log(res.nonce_str);
      console.log(res.data.prepay_id);
      console.log(res.data.sign);
      Taro.requestPayment({
        timeStamp: res.data.appid,
        nonceStr: res.data.nonce_str,
        package: res.data.prepay_id,
        signType: res.data.signType, // 'MD5',
        paySign: res.data.sign,
        success(res) {
          console.log('支付成功');
        },
        fail(res) {
          console.log(res.errMsg);
          console.log('取消支付');
        },
        complete(res) {
          console.log(res.errMsg);
          console.log('支付失败');
        }
      });
    },
    fail() {
      Taro.showModal({
        title: '提示',
        content: '请求失败',
        showCancel: false,
        success(res) {}
      });
    }
  });
};
</script>

<style src="./index.css" />
