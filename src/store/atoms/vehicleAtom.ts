import { atom } from "recoil";

export interface IVehicle {
	id: string;
	carName: string;
	kwh: string;
	chargingPort: string;
}

export const vehicleListState = atom<IVehicle[]>({
	key: "vehicleListState",
	default: [],
});
