// import { request } from "../request";
import Taro from "@tarojs/taro";

export const config = {
	APIURL: "http://ivapi.xinyunyiyun.cn",
	URL: "http://h5.xinyunyiyun.cn/",
	OVERTIME: 1 * 60 * 60 * 1000,
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
	answer:string;
	last?:string;
}

export async function fetchTestTopic(data: TestTopicParams) {
	// return request.post<any>(config.APIURL + "/test/topic", data, {
	// 	useErrMsg: true,
	// });

	return await Taro.request({
		url: config.APIURL + "/test/topic", //仅为示例，并非真实的接口地址
		data,
		header: {
			"content-type": "application/json", // 默认值
		},
	});
}

export async function fetchUserTopic(data: UserTopicParams) {
	return await Taro.request({
		url: config.APIURL + "/user//topic", //仅为示例，并非真实的接口地址
		data,
		header: {
			"content-type": "application/json", // 默认值
		},
	});
}
