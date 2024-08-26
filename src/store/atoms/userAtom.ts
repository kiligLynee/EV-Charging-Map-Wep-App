import { atom, selector } from "recoil";
import { getUserInfo } from "../../utils/user-token";

// type UserInfo = Record<string, string | number>;

export interface IRootObject {
	vehicles?: IVehicles;
	userinfo?: IUserinfo;
	token?: string;
}
export interface IVehicles {
	id?: string;
	carName?: string;
	kwh?: string;
	chargingPort?: string;
}
export interface IUserinfo {
	id?: string;
	username?: string;
	password?: null;
	email?: string;
	token?: string;
	status?: number;
	vehicleId?: string;
}

let userInfo: IRootObject;

try {
	const ui = getUserInfo()
	if (ui === undefined) {
		userInfo = {}
	} else {
		userInfo = JSON.parse(ui)
	}
} catch (error) {
	userInfo = {}
	console.log('----userInfoState---userInfo---error:', error);
}

export const userInfoState = atom<IRootObject>({
	key: "userInfoState",
	default: userInfo,
});

export const userVehicleBatteryCapacityState = selector({
	key: 'userVehicleBatteryCapacity',
	get: ({ get }) => {
		const userInfo = get(userInfoState)
		const vehicle = userInfo.vehicles || {}
		return Number(vehicle?.kwh || 0) 
	}
})

export const userVehicleChargingPortTypeState = selector({
	key: 'userVehicleChargingPortTypeState',
	get: ({ get }) => {
		const userInfo = get(userInfoState)
		const vehicle = userInfo.vehicles
		return vehicle?.chargingPort
	}
})
