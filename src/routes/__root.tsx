// import { Outlet, createRootRouteWithContext, redirect } from '@tanstack/react-router'
// import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
//
// import Header from '../components/header'
//
// import TanstackQueryLayout from '../integrations/tanstack-query/layout'
//
// import type { QueryClient } from '@tanstack/react-query'
//
// interface MyRouterContext {
//   queryClient: QueryClient
// }
//
// export const Route = createRootRouteWithContext<MyRouterContext>()({
//   beforeLoad: async ({ context, location }) => {
//     console.log(location.href)
//     // if (!context.auth.isAuthenticated) {
//     //   console.log(context)
//     //   throw redirect({
//     //     to: "/sign-in",
//     //     search: {
//     //       app_redirect: location.href,
//     //     },
//     //   });
//     // }
//     //
//     // if (context.auth.isAuthenticated && location.searchStr !== "") {
//     //   throw redirect({
//     //     to: location.search.app_redirect,
//     //   });
//     // }
//   },
//   component: () => (
//     <>
//       <Header />
//
//       <Outlet />
//       <TanStackRouterDevtools />
//
//       <TanstackQueryLayout />
//     </>
//   ),
// })


import {
  createRootRouteWithContext,
  Link,
  Outlet,
  redirect,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import {useAuthContext} from "@/lib/auth/use-auth-context";

import TanstackQueryLayout from '../integrations/tanstack-query/layout'

import type { QueryClient } from '@tanstack/react-query'
import Header from "@/components/header";

interface MyRouterContext {
  queryClient: QueryClient
}

// const Header = () => {
//   const { isAuthenticated, logout } = useAuthContext();
//   return (
//     <div className="p-2 flex gap-2">
//       {isAuthenticated ? (
//         <>
//           <Link to="/" className="[&.active]:font-bold">
//             Home
//           </Link>{" "}
//           <Link to="/dashboard" className="[&.active]:font-bold">
//             Dashboard
//           </Link>{" "}
//           <Link to="/about" className="[&.active]:font-bold">
//             About
//           </Link>{" "}
//           <a href="/" className="[&.active]:font-bold" onClick={logout}>
//             Logout
//           </a>
//         </>
//       ) : (
//         <>
//           <Link href="/auth" className="[&.active]:font-bold">
//             Log In
//           </Link>
//         </>
//       )}
//     </div>
//   );
// };

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
  const { isAnonymous, isAuthenticated } = useAuthContext();

  return (
    <>
      <Header isAuthenticated={isAuthenticated}/>

      <Outlet />
      <TanStackRouterDevtools />

      <TanstackQueryLayout />
    </>
  );
};

export const Route = createRootRouteWithContext()({
  beforeLoad: async ({ context, location }) => {
    console.log(context)
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
  component: RootComponent,
});
