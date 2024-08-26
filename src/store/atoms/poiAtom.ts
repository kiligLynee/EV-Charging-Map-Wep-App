import { atom } from "recoil";
import { PoiType } from "../../pages/search/types";


export const allPoiState = atom<PoiType[]>({
	key: "allPoiState",
	default: [],
});

export const activePoiState = atom<PoiType | null>({
	key: "activePoiState",
	default: null,
});

export const isShowActivePoiState = atom<boolean>({
	key: "isShowActivePoiState",
	default: false,
	// default: true,
});
