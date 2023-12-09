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

export function debounce(fn: Function, wait: number) {
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

export const sleep = (delaytime = 1000) => {
  return new Promise(resolve => setTimeout(resolve, delaytime));
};
