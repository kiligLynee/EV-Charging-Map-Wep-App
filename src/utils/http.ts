import { message } from "antd";
import axios from "axios";
import { getUserToken } from "./user-token";

const instance = axios.create({
	timeout: 10 * 1e3,
});

instance.interceptors.request.use(
	(config) => {
		const token = getUserToken();
		if (token) {
			config.headers["Authorization"] = `Bearer ${token}`;
		}
		return config;
	},
	(err) => {
		return Promise.reject(err);
	}
);

instance.interceptors.response.use((res) => {
	// debugger;
	const resData = res.data || {};
	const { code, message: msg, data } = resData;

	if (code !== 200) {
		if (msg) {
			message.error(msg, 6);
		}
		throw new Error(msg);
	}

	return data as any;
});

export default instance;

export type RespDataType = {
	[key: string]: any;
};

export type RespType<T = RespDataType> = {
	errno: number;
	data?: T;
	msg?: string;
};
