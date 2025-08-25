import type { RouteObject } from "react-router-dom";
import { lazy, Suspense } from "react";
import type { ReactNode } from "react";
import SpinningLoader from "@/components/config/spinner";

const lazyLoad = (Component: ReturnType<typeof lazy>): ReactNode => (
  <Suspense fallback={<SpinningLoader message="Loading..." />}>
    <Component />
  </Suspense>
);

const routeConfig = {
  home: { path: "/", component: lazy(() => import("@/pages/Home")) },
  login: {
    path: "/login",
    component: lazy(() => import("@/pages/auth/Login")),
  },
  register: {
    path: "/register",
    component: lazy(() => import("@/pages/auth/Register")),
  },

  profile: {
    path: "/profile",
    component: lazy(() => import("@/pages/auth/Profile")),
  },

  onboarding: {
    path: "/onboarding",
    component: lazy(() => import("@/pages/auth/Onboarding")),
  },

  card: {
    path: "/card",
    component: lazy(() => import("@/pages/Card")),
  },

  logout: {
    path: "/logout",
    component: lazy(() => import("@/pages/auth/Logout")),
  },

  notFound: { path: "*", component: lazy(() => import("@/pages/NotFound")) },
};

// Generate the routes array dynamically
export const routes: RouteObject[] = Object.values(routeConfig).map(
  ({ path, component: Component }) => ({
    path,
    element: lazyLoad(Component),
  })
);
