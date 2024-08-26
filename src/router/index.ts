import { createBrowserRouter } from "react-router-dom";

import type { Router } from "@remix-run/router/dist/router";
import { routes } from "./routes";
import { beforeEach } from "./before-each";

export const router: Router = createBrowserRouter(beforeEach(routes));
