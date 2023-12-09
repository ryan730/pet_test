import Taro, { getEnv, getAccountInfoSync, showToast } from '@tarojs/taro';
import { request } from '../request';

export const config = {
  APIURL: 'https://api.xinyunyiyun.cn',
  // APIURL: 'http://ivapi.xinyunyiyun.cn',
  URL: 'http://h5.xinyunyiyun.cn/',
  OVERTIME: 1 * 60 * 60 * 1000
};

interface TestTopicParams {
  utid: string;
  test_id: string;
  cur: string;
}

interface UserTopicParams {
  utid: string;
  test_id: string;
  number: string;
  answer: string;
  last?: string;
}

export const getToken = () => {
  const token = Taro.getStorageSync('token');
  return token;
};

function setLocalStorage(result: any) {
  Taro.setStorageSync('avatar', result?.avatar);
  Taro.setStorageSync('nickname', result?.nickname);
  Taro.setStorageSync('token', result?.token);
  Taro.setStorageSync('uid', result?.uid);
  Taro.setStorageSync('time', new Date().getTime());
  Taro.setStorageSync('unionid', result?.unionid);
}

async function fetch(url: string, data: any) {
  const token = getToken();
  const header = {
    'content-type': 'application/json' // 默认值
  };
  if (token) {
    header.Authorization = token;
  }
  console.log('fetch-req:', url, data, header);
  try {
    const res = await Taro.request({
      url,
      data,
      // method: 'POST',
      header
    });

    if (res?.statusCode != 200) {
      showToast({
        title: '返回异常',
        icon: 'none'
      });
      console.log('fetch-res:', res);
      return Promise.reject(res);
    } else if (res?.data?.code != 1) {
      showToast({
        title: res?.data?.msg || '返回异常',
        icon: 'none'
      });
      console.log('fetch-res:', res, res?.data?.msg);
      return Promise.reject(res);
    }
    return Promise.resolve(res.data);
  } catch (e) {
    console.log('e:', e);
    showToast({
      title: '返回异常',
      icon: 'none'
    });
    return Promise.reject({});
  }
}

// export async function fetchTestTopic(data: TestTopicParams) {
//   // return request.post<any>(config.APIURL + "/test/topic", data, {
//   // 	useErrMsg: true,
//   // });

//   return await Taro.request({
//     url: `${config.APIURL}/test/topic`, // 仅为示例，并非真实的接口地址
//     data,
//     header: {
//       'content-type': 'application/json' // 默认值
//     }
//   });
// }

// export async function fetchUserTopic(data: UserTopicParams) {
//   return await Taro.request({
//     url: `${config.APIURL}/user//topic`, // 仅为示例，并非真实的接口地址
//     data,
//     header: {
//       'content-type': 'application/json' // 默认值
//     }
//   });
// }
// 登陆
interface UserLoginParams {
  code: string;
}

export async function fetchUserLoginApp(data: UserLoginParams) {
  const token = getToken();
  if (!token) {
    const result = await fetch(`${config.APIURL}/user/userLoginApp`, data);
    setLocalStorage(result?.data);
  }
  const curTime = new Date().getTime();
  const time = Taro.getStorageSync('time');
  if (curTime - time >= config.OVERTIME) {
    const result = await fetch(`${config.APIURL}/user/userLoginApp`, data);
    setLocalStorage(result?.data);
  }
}

interface ProductInfoParams {
  utid: string;
  test_id: string;
  cur: string;
}
/// test/productInfo
export async function fetchProductInfo(data: ProductInfoParams) {
  const result = await fetch(`${config.APIURL}/test/productInfo`, data);
  return result;
}

interface TestTopicParams {
  utid: string;
  test_id: string;
  cur: string;
}
/// test/topic
export async function fetchTestTopic(data: TestTopicParams) {
  const result = await fetch(`${config.APIURL}/test/topic`, data);
  return result;
}

interface UserTopicParams {
  utid: string;
  test_id: string;
  cur: string;
  number: string;
  answer?: number | string;
  last?: string;
}
/// test/topic
export async function fetchUserTopic(data: UserTopicParams) {
  const result = await fetch(`${config.APIURL}/user/topic`, data);
  return result;
}

interface SeriesReport {
  reportid: Array<string>;
}
/// test/topic
export async function fetchSeriesReport(data: SeriesReport) {
  const result = await fetch(`${config.APIURL}/user/seriesReport`, data);
  return result;
}
