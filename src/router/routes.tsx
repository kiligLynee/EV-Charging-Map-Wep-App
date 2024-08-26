import { RouteObject } from "react-router-dom";
// import LayoutComp from "../layout-comp/LayoutComp";
// import NotFoundView from "../views/not-found-view/NotFoundView";
import React, { FC } from "react";
import { PageError } from "../pages/page-error";
import { NotFound } from "../pages/not-found";
import { MainLayout } from "../layout/main-layout";
// import ManageLayout from "../layout/manage-layout/ManageLayout";
// import QuestionLayout from "../layout/question-layout/QuestionLayout";

// 懒加载代码 vite 专用
const modules = import.meta.glob<boolean, string, { default: FC }>(
	"../pages/**/*.tsx"
);
const lazyLoad = (path: string) => {
	const key = `../pages/${path}.tsx`;
	// console.log("modulesLevel1: ", modules);
	// console.log("key: ", key);
	// console.log("modules[key]: ", modules[key]);
	// 调用 modules[key] 函数以返回 Promise
	const Comp = React.lazy(() => modules[key]());
	// const Comp = React.lazy(modules[key]);
	return (
		<React.Suspense fallback={<>加载中...</>}>
			<Comp />
		</React.Suspense>
	);
};

const publicRoutes: RouteObject[] = [
	{
		path: "/",
		element: <MainLayout />,
		errorElement: <PageError />,
		children: [
			{
				path: "/",
				element: lazyLoad("home/index"),
			},
			{
				path: "login",
				element: lazyLoad("login/index"),
			},
			{
				path: "register",
				element: lazyLoad("register/index"),
			},
			{
				path: "search",
				element: lazyLoad("search/index"),
			},
			{
				path: "us",
				element: lazyLoad("us/index"),
			},
			// {
			//     path: 'manage',
			//     element: <ManageLayout />,
			//     children: [
			//         {
			//             path: 'list',
			//             element: lazyLoad('manage/list/index'),
			//         },
			//         {
			//             path: 'star',
			//             element: lazyLoad('manage/star/index'),
			//         },
			//         {
			//             path: 'trash',
			//             element: lazyLoad('manage/trash/index'),
			//         },
			//     ],
			// },
			{
				path: "*",
				element: <NotFound />,
			},
			// {
			//   path: "topic/:id",
			//   element: lazyLoad("topic-view/TopicView"),
			// },
			// {
			//   path: "user/:username",
			//   element: lazyLoad("user-view/UserView"),
			// },
			// {
			//   path: "about",
			//   element: lazyLoad("about-view/AboutView"),
			// },
		],
	},
	// {
	//     path: '/question',
	//     element: <QuestionLayout />,
	//     children: [
	//         {
	//             path: 'edit/:id',
	//             element: lazyLoad('question/edit/index'),
	//         },
	//         {
	//             path: 'stat/:id',
	//             element: lazyLoad('question/stat/index'),
	//         },
	//     ],
	// },
];

export const routes: RouteObject[] = [...publicRoutes];

// -------------------------- 分割线 --------------------------

// 常用的路由常量
export const HOME_PATHNAME = "/";
export const LOGIN_PATHNAME = "/login";
export const REGISTER_PATHNAME = "/register";
export const SEARCH_PATHNAME = "/search";

export function isLoginOrRegister(pathname: string) {
	return [LOGIN_PATHNAME, REGISTER_PATHNAME].includes(pathname);
}
export function isNoNeedLogin(pathname: string) {
	return [LOGIN_PATHNAME, REGISTER_PATHNAME, HOME_PATHNAME].includes(
		pathname
	);
}
