import { log } from 'console'; import { onMounted } from 'vue';
<template>
  <div class="score-prograss">
    <div class="containerr">
      <div class="title">综合得分</div>
      <div class="prograss">
        <div class="rect-container">
          <div class="rect-bg"></div>
          <div v-for="(item, index) in progressArr" class="rect-unit">
            <div class="rect-unit-text">{{ item }}</div>
          </div>
        </div>
        <div class="score-red" :progressTotal="progressTotal" :style="{ width: width }">
          <div class="score-red-text">{{ currentPercent }}</div>
        </div>
      </div>
    </div>
    <div class="flo">
      <div class="font">低</div>
      <div class="font">中</div>
      <div class="font">高</div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import Taro from '@tarojs/taro';

interface Props {
  percent: number;
  max: number;
  min: number;
  step: number;
}

const progressTotal = ref(1);
const progressArr = ref([]);

const props = withDefaults(defineProps<Props>(), {
  percent: 50,
  min: 5,
  max: 35,
  step: 5
});

const width = computed(() => {
  // const realcur = props.percent - props.min;
  // const mutil = parseInt(realcur / props.step);
  // const remainder = realcur - mutil * props.step;
  // const total = 82 * mutil + (remainder / props.step) * 82;
  // console.log('width=====', Taro.pxTransform(total));
  // return Taro.pxTransform(total);
  const total = ((props.percent - props.min) / (props.max - props.min)) * progressTotal.value;
  return `${total}px`;
  // return (props.percent / parseInt(props.max + props.min)) * progressTotal.value;
});

const currentPercent = computed(() => {
  return props.percent;
});

onMounted(() => {
  Taro.nextTick(() => {
    const query = Taro.createSelectorQuery();
    query
      .select('.rect-bg')
      .boundingClientRect(res => {
        console.log('res=======', res, res.width);
        progressTotal.value = res.width;
      })
      .exec();
  });

  /// progressArr.value = parseInt((props.max - props.min) / props.step);
  let i = props.min;
  const arr = [i];
  while (i < props.max) {
    i += props.step;
    arr.push(i);
  }
  progressArr.value = arr;
});
</script>
<style lang="scss">
.score-prograss {
  .containerr {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 80px;
    .title {
      box-sizing: border-box;
      overflow-wrap: break-word;
      color: rgba(34, 34, 34, 1);
      font-size: 28px;
      font-family: PingFang-SC-Bold;
      font-weight: normal;
      text-align: justify;
      white-space: nowrap;
      line-height: 48px;
      margin-top: 15px;
      margin-right: 15px;
    }

    .prograss {
      display: flex;
      width: 100%;
      height: 80px;

      .score-red-text {
        box-sizing: border-box;
        overflow-wrap: break-word;
        color: rgba(255, 255, 255, 1);
        font-size: 23px;
        font-family: PingFang-SC-Bold;
        font-weight: normal;
        text-align: right;
        white-space: nowrap;
        line-height: 28px;
        margin-top: 5px;
        margin-right: 5px;
      }

      .score-red {
        box-sizing: border-box;
        height: 30px;
        background: linear-gradient(90deg, #ffcac2, #fc6851);
        display: flex;
        flex-direction: column;
        width: 283px;
        position: absolute;
        //padding: 0 7px 1px 251px;
        margin-top: 25px;
      }

      .rect-container {
        box-sizing: border-box;
        flex-direction: row;
        display: flex;
      }

      .rect-bg {
        box-sizing: border-box;
        background-color: rgba(255, 245, 243, 1);
        //border-radius: 4px;
        position: relative;
        //width: 480px;
        border: 1px solid rgba(254, 168, 154, 1);
        flex-direction: row;
        display: flex;
        //justify-content: start;
        //padding: 0 80px 2px 80px;
        height: 80px;

        width: 488px;
        position: absolute;
      }

      .rect-unit {
        width: 80px;
        height: 79px;
        border-left: 1px dashed rgba(254, 168, 154, 1);
        text-align: center;
        //transform: scale(0.6, 0);
        z-index: 1;
        &:last-child {
          border: 0;
          width: 26px;
        }
      }

      .rect-unit-text {
        display: flex;
        margin-top: -40px;
        margin-left: -14px;
        font-size: 22px;
        color: gray;
      }
    }
  }
  .flo {
    box-sizing: border-box;
    width: 350px;
    flex-direction: row;
    display: flex;
    justify-content: space-between;
    margin: 4px 84px 0 195px;
    .font {
      box-sizing: border-box;
      overflow-wrap: break-word;
      color: rgba(34, 34, 34, 1);
      font-size: 22px;
      font-family: PingFang-SC-Bold;
      font-weight: normal;
      text-align: justify;
      line-height: 48px;
    }
  }
}
</style>
