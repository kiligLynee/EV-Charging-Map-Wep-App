import axios, { RespDataType } from "../utils/http";

// get user information
export async function getUserInfo(): Promise<RespDataType> {
	const url = `/api/user/info`;
	const data = (await axios.get(url)) as RespDataType;
	return data;
}

// Get vehicle list
export async function getVehicleList(): Promise<RespDataType> {
	const url = `/api/vehicles/list`;
	const resData = (await axios.get(url, {})) as RespDataType;
	return resData;
}

// registered user
export async function registerUser(data: any): Promise<RespDataType> {
	const url = `/api/user/register`;
	const resData = (await axios.post(url, { ...data })) as RespDataType;
	return resData;
}

// user login 
export async function userLogin(data: any): Promise<RespDataType> {
	const url = `/api/user/login`;
	const resData = (await axios.post(url, { ...data })) as RespDataType;
	return resData;
}
