import { RouteObject } from "react-router-dom";

// permission filtering
export const beforeEach: (routes: RouteObject[]) => RouteObject[] = (
	routes
) => {
	//
	// return [];
	return routes;
};
