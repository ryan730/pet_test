/**
 * 根据数字获取对应的汉字
 * @param num - 数字(0-10)
 */
export function getHanByNumber(num: number) {
  const HAN_STR = '零一二三四五六七八九十';
  return HAN_STR.charAt(num);
}

/**
 * 将总秒数转换成 分：秒
 * @param seconds - 秒
 */
export function transformToTimeCountDown(seconds: number) {
  const SECONDS_A_MINUTE = 60;
  function fillZero(num: number) {
    return num.toString().padStart(2, '0');
  }
  const minuteNum = Math.floor(seconds / SECONDS_A_MINUTE);
  const minute = fillZero(minuteNum);
  const second = fillZero(seconds - minuteNum * SECONDS_A_MINUTE);
  return `${minute}: ${second}`;
}

/**
 * 获取指定整数范围内的随机整数
 * @param start - 开始范围
 * @param end - 结束范围
 */
export function getRandomInterger(end: number, start = 0) {
  const range = end - start;
  const random = Math.floor(Math.random() * range + start);
  return random;
}

export function debounce2(fn: Function, wait: number) {
  const callback = fn;
  let timerId = null;
  // 是否是第一次执行
  let firstInvoke = true;

  function debounced() {
    // 保存作用域
    const context = this;
    // 保存参数，例如 event 对象
    const args = arguments;
    clearTimeout(timerId);
    // 如果是第一次触发，直接执行
    if (firstInvoke) {
      console.log('第一次触发');
      callback.apply(context, args);
      firstInvoke = false;
      return;
    }

    timerId = setTimeout(function () {
      callback.apply(context, args);
    }, wait);
  }

  // 返回一个闭包
  return debounced;
}

export function debounce(func: Function, wait: number = 500, immediate: boolean = true) {
  let timeout: any;
  return function (this: any, ...args: any[]) {
    const context = this;
    const later = function () {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
}

export const sleep = (delaytime = 1000) => {
  return new Promise(resolve => setTimeout(resolve, delaytime));
};

export const getAnimaoType = (num: number) => {
  return num == 46 ? 'dog' : 'cat';
};

export const getAnimaoPic = (num: number) => {
  return {
    bg: num == 46 ? require('@/assets/images/p2@2x.png') : require('@/assets/images/p1@2x.png'),
    foot: num == 46 ? require('@/assets/images/p2@foot.png') : require('@/assets/images/p1@foot.png'),
    char: num == 46 ? require('@/assets/images/p2-char@2x.png') : require('@/assets/images/p1-char@2x.png'),
    fchar: num == 46 ? require('@/assets/images/p2-f-char.png') : require('@/assets/images/p1-f-char.png')
  };
};

import Taro, { getWindowInfo } from '@tarojs/taro';
let cachePid = '';
export const getURLParamsPID = () => {
  const launchInfo = {}; // Taro.getLaunchOptionsSync();
  const instance = Taro.getCurrentInstance();
  const pid = launchInfo?.query?.pid || instance?.router?.params?.pid;
  if (cachePid && (cachePid == pid || !pid)) {
    console.log('入口参数2', cachePid);
    return cachePid;
  }
  cachePid = pid; // || 46;
  console.log('入口参数1', launchInfo?.query?.pid, instance?.router?.params?.pid);
  return cachePid;
};

export const designToRealForPX = (designNum: number) => {
  const pageInfo = Taro.getSystemInfoSync();
  console.log('designToRealForPX', pageInfo);
  const windowWidth = pageInfo.windowWidth;
  const percent = windowWidth / 750;
  return Math.floor(designNum * percent);
};

/* 获取当前页url */
export const getCurrentPageUrl = () => {
  const pages = Taro.getCurrentPages(); // 获取加载的页面
  const currentPage = pages[pages.length - 1]; // 获取当前页面的对象
  const url = currentPage.route; // 当前页面url
  return url;
};
/* 获取当前页参数 */
export const getCurrentPageParam = () => {
  const pages = Taro.getCurrentPages(); // 获取加载的页面
  const currentPage = pages[pages.length - 1]; // 获取当前页面的对象
  const options = currentPage.options; // 如果要获取url中所带的参数可以查看options
  return options;
};
