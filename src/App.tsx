// import { useState } from "react";
import { RouterProvider } from "react-router-dom";
import "./App.css";
import { RecoilRoot } from "recoil";
import { router } from "./router";

export const App = () => {
	return (
		<RecoilRoot>
			<RouterProvider router={router}></RouterProvider>
		</RecoilRoot>
	);
};