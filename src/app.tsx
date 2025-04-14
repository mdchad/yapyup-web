// import { createRouter, RouterProvider } from "@tanstack/react-router";
// import { routeTree } from "@/routeTree.gen.ts";
// import { useEffect } from "react";
// import {useAuthContext} from "@/lib/auth/use-auth-context";
//
import * as TanstackQuery from './integrations/tanstack-query/root-provider'
//
// const router = createRouter({
//   routeTree,
//   context: {
//     auth: undefined!,
//     ...TanstackQuery.getContext(),
//
//   },
//   defaultPreload: 'intent',
// });
//
// // Register the router instance for type safety
// declare module "@tanstack/react-router" {
//   interface Register {
//     router: typeof router;
//   }
// }
//
// export const App = () => {
//   const auth = useAuthContext();
//   console.log(auth)
//
//   useEffect(() => {
//     router.invalidate();
//   }, [auth.isAuthenticated]);
//
//   return <RouterProvider router={router} context={{ auth }} />;
// };


import { createRouter, RouterProvider } from "@tanstack/react-router";
import { routeTree } from "@/routeTree.gen.ts";
import { useEffect } from "react";
import {useAuthContext} from "@/lib/auth/use-auth-context";

const router = createRouter({
  routeTree,
  context: {
    auth: undefined!,
    ...TanstackQuery.getContext(),
  },
  defaultPreload: 'intent',
  scrollRestoration: true,
  defaultStructuralSharing: true,
  defaultPreloadStaleTime: 0,
});

// Register the router instance for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export const App = () => {
  const auth = useAuthContext();

  useEffect(() => {
    router.invalidate();
  }, [auth.isAuthenticated]);

  return <RouterProvider router={router} context={{ auth }} />;
};

