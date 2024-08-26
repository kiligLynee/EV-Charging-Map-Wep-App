import { atom } from "recoil";


export const currentLevelState = atom<number | undefined>({
    key: "currentLevelState",
    default: undefined,
});

export const desiredLevelState = atom<number | undefined>({
    key: "desiredLevelState",
    default: undefined,
});