import { ref, onMounted, onBeforeMount } from 'vue';
import Taro from '@tarojs/taro';

export default function useShare(initialShareInfo = {}) {
  const getpsid = () => {
    const launchInfo = Taro.getLaunchOptionsSync();
    const psid = launchInfo?.query?.cq || Taro.getStorageSync('cq');
    return psid; // + new Date().getTime();
  };

  const shareConfig = {
    enableShareAppMessage: true, // 分享好友
    enableShareTimeline: true, // 分享朋友圈
    ...initialShareInfo
  };

  const shareInfo = ref({
    title: '宠物性格测试',
    path: `/pages/home/index?cq=${getpsid() || ''}`,
    ...initialShareInfo
  });

  // 分享处理函数
  const onShareAppMessage = () => shareInfo.value;

  // 朋友圈处理
  const onShareTimeline = () => shareInfo.value;

  // 配置页面分享功能
  onBeforeMount(() => {
    const pageVm = getCurrentPageVm();
    console.log('getCurrentPages=======>>>', pageVm);
    if (pageVm) {
      // const currentPageConfig = pageVm.config || {};
      // currentPageConfig.enableShareAppMessage = shareConfig.enableShareAppMessage;
      // currentPageConfig.enableShareTimeline = shareConfig.enableShareTimeline;
      // pageVm.config = currentPageConfig;
      // pageVm.config = { ...pageVm.config, ...currentPageConfig };
      pageVm.onShareAppMessage = onShareAppMessage;
      pageVm.onShareTimeline = onShareTimeline;
    }
  });

  return { onShareAppMessage, onShareTimeline, shareConfig };
}

// 获取当前页面实例
function getCurrentPageVm() {
  const pages = Taro.getCurrentPages();
  return pages[pages.length - 1];
}
