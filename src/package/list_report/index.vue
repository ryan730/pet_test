<template>
  <cg-navbar2 :title="宠物性格测试" />
  <div class="list-report" :style="getStyle">
    <nut-tabs v-model="value">
      <nut-tab-pane v-for="(item, index) in ['宠物报告', '未完成的测试']" :title="item" :pane-key="index1">
        <nut-cell>
          <nut-list :height="201" :list-data="state.count" @scroll-bottom="handleScroll">
            <template #default="{ item, index }">
              <div class="left-pic">
                <img src="" />
              </div>
              <div class="right">
                <div class="content-left">
                  <div class="time">时间：2023.12.12</div>
                  <div class="name">猫猫名字：铁饭碗</div>
                  <div class="age">年龄：3岁</div>
                </div>
                <div class="content-right">
                  <div class="but" @click="handleGoDatil">
                    <div class="text">查看报告</div>
                  </div>
                </div>
              </div>
            </template>
          </nut-list>
        </nut-cell>
      </nut-tab-pane>
    </nut-tabs>
  </div>
  "
</template>
<script setup>
import { onMounted, reactive, computed, ref } from 'vue';
import Taro, {
  getEnv,
  navigateBack,
  getWindowInfo,
  pxTransform,
  getSystemInfoSync,
  getCurrentInstance
} from '@tarojs/taro';
import { useAppStore, useProductInfoStore } from '@/store';

const value = ref('0');

const appStore = useAppStore();

const getStyle = computed(() => {
  return {
    marginTop: `${pxTransform(appStore.getNavHeight)}`,
    height: `calc(100% - ${appStore.getNavHeight}px)`
  };
});

const state = reactive({
  count: new Array(100).fill(0)
});

const handleScroll = () => {
  const arr = new Array(100).fill(0);
  const len = state.count.length;
  state.count = state.count.concat(arr.map((item, index) => len + index + 1));
};

onMounted(() => {
  state.count = state.count.map((item, index) => index + 1);
});

const handleGoDatil = () => {
  // ["600","601"]
  const productInfoStore = useProductInfoStore();
  productInfoStore.setInfo({
    report_id: ['600', '601']
  });
  Taro.navigateTo({
    url: '/package/simple_report/index'
  });
};
</script>
<style lang="scss">
.list-report {
  .nut-tabs__titles {
    height: 120px;
    background: #f4f6f9;
  }

  .nut-tabs__list {
    background-color: white;
  }

  .nut-tab-pane {
    padding: 0;
  }

  .tab {
    width: 100%;
    height: 88px;
    background: #ffffff;
    box-shadow: 0px 4px 6px 0px rgba(218, 218, 218, 0.19);
  }

  .nut-list-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background: #f4f6f9;
  }

  .nut-cell {
    height: 100%;
  }

  .nut-list-item {
    display: flex;
    align-items: center;
    justify-content: space-around;
    width: 710px;
    height: 201px;
    background: #ffffff;
    border-radius: 14px;
    margin-bottom: 23px;

    .left-pic {
      width: 164px;
      height: 164px;
      background-color: #f5f;
    }

    .right {
      height: 164px;
      //background-color: #ef4;
      //width: 100%;
      display: flex;
    }

    .content-left {
      width: 238px;
      height: 100%;
      //background-color: red;
      font-size: 26px;
      font-family: PingFang-SC, PingFang-SC;
      font-weight: 500;
      color: #000000;
      line-height: 37px;
      flex-direction: column;
      justify-content: center;
      //align-items: center;
      display: flex;
      div {
        margin-bottom: 7px;
        //margin-left: 21px;
      }
    }

    .content-right {
      width: 172px;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      margin: 0 0 0 33px;
      .but {
        width: 172px;
        height: 60px;
        background: linear-gradient(90deg, #ff836b 0%, #ff4217 100%);
        border-radius: 30px;
        display: flex;
        justify-content: center;
        align-items: center;
        .text {
          width: 104px;
          height: 37px;
          font-size: 26px;
          font-family: PingFang-SC, PingFang-SC;
          font-weight: 500;
          color: #ffffff;
          line-height: 37px;
        }
      }
    }
  }
}
</style>
