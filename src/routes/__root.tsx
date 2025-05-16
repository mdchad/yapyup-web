import {
  createRootRouteWithContext,
  Link,
  Outlet,
  redirect, useLocation, useRouter,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'

import TanstackQueryLayout from '../integrations/tanstack-query/layout'

import type { QueryClient } from '@tanstack/react-query'
import { Header } from "@/components/ui/header";
import DashboardHeader from "@/components/ui/dashboard-header";
// import Header from "@/components/header";

interface MyRouterContext {
  queryClient: QueryClient
}

const AnonBanner = () => {
  return (
    <div className="bg-yellow-100 dark:bg-yellow-900 px-4 py-2 text-center text-sm">
      <span className="text-yellow-800 dark:text-yellow-200">
        You're using an anonymous account. Your data will be lost if you don't{" "}
        <Link
          to="/auth/link-account"
          className="font-semibold underline hover:text-yellow-950 dark:hover:text-yellow-50"
        >
          create an account
        </Link>
      </span>
    </div>
  );
};

const RootComponent = () => {
  return (
    <div className="h-screen flex flex-col">
      <Outlet />

      {/*<TanStackRouterDevtools />*/}
      <TanstackQueryLayout />
    </div>
  );
};

export const Route = createRootRouteWithContext()({
  beforeLoad: async ({ context, location }) => {
    const isDashboardRoute = location.pathname.startsWith('/dashboard')
    if (!context.auth.isAuthenticated && isDashboardRoute) {
      throw redirect({
        to: "/sign-in",
        search: {
          app_redirect: location.href,
        },
      });
    }

    if (context.auth.isAuthenticated && location.searchStr !== "") {
      throw redirect({
        to: location.search.app_redirect,
      });
    }
  },
  component: RootComponent
});
