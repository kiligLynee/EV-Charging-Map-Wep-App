import Cookies from 'js-cookie'

export const USER_TOKEN_KEY = 'USER_TOKEN_KEY';
export const USER_INFO_KEY = 'USER_INFO_KEY';


// Cookie 有效期 单位 天
const EXPIRES_IN = 1 * 4 / 24 // 此处 1 是 1 天，  4 是 4小时 

export const setUserInfoInCookie = (userInfoStr: string) => {
    // localStorage.setItem(USER_TOKEN_KEY, token);
    Cookies.set(USER_INFO_KEY, userInfoStr, { expires: EXPIRES_IN })
};

export const getUserInfo = () => {
    // localStorage.setItem(USER_TOKEN_KEY, token);
    return Cookies.get(USER_INFO_KEY)
};

export const setUserToken = (token: string) => {
    // localStorage.setItem(USER_TOKEN_KEY, token);
    Cookies.set(USER_TOKEN_KEY, token, { expires: EXPIRES_IN })
};

export const getUserToken = () => {
    // return localStorage.getItem(USER_TOKEN_KEY);
    return Cookies.get(USER_TOKEN_KEY);
};
