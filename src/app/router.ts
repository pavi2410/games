import { createRouter } from "@solidjs/router";
import { games } from "../games/registry";
import Home from "./home/Home";
import NotFound from "./NotFound";

export const Router = createRouter({
  routes: [
    { path: "/", component: Home },
    ...games.map((g) => ({ path: `/${g.id}`, component: g.component })),
    { path: "*404", component: NotFound },
  ],
});
