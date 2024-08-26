import { useLocation, useNavigate } from "react-router-dom";
import { isNoNeedLogin, LOGIN_PATHNAME } from "./routes";
import { getUserToken } from "../utils/user-token";
import { useEffect } from "react";

export const usePermission = () => {
	const location = useLocation();
	const navigate = useNavigate();
	// console.log("location: ", location);
	const { pathname } = location;
	const isLogin = getUserToken();
	// console.log("isLogin: ", isLogin);
	// console.log("pathname: ", pathname);
	// console.log("isNoNeedLogin(pathname): ", isNoNeedLogin(pathname));

	useEffect(() => {
		// console.log('----isNoNeedLogin(pathname): ', isNoNeedLogin(pathname));

		// debugger
		if (!isNoNeedLogin(pathname) && !isLogin) {
			navigate(LOGIN_PATHNAME);
		}
	}, [isLogin, pathname, navigate]);
};
