// import { StrictMode, useEffect } from 'react'
// import ReactDOM from 'react-dom/client'
// import { RouterProvider, createRouter } from '@tanstack/react-router'
// import { AuthProvider } from '@/lib/auth/auth-provider'
// import { useAuthContext } from '@/lib/auth/use-auth-context'
//
// import * as TanstackQuery from './integrations/tanstack-query/root-provider'
//
// // Import the generated route tree
// import { routeTree } from './routeTree.gen'
//
// import './styles.css'
// import reportWebVitals from './reportWebVitals.ts'
// import {App} from "@/app";
//
// // // Create a new router instance
// // const router = createRouter({
// //   routeTree,
// //   context: {
// //     ...TanstackQuery.getContext(),
// //     auth: undefined!, // We'll inject this when we render
// //   },
// //   defaultPreload: 'intent',
// //   scrollRestoration: true,
// //   defaultStructuralSharing: true,
// //   // defaultPreloadStaleTime: 0,
// // })
// //
// // // Register the router instance for type safety
// // declare module '@tanstack/react-router' {
// //   interface Register {
// //     router: typeof router
// //   }
// // }
//
// // Render the app
// const rootElement = document.getElementById('app')
// if (rootElement && !rootElement.innerHTML) {
//   const root = ReactDOM.createRoot(rootElement)
//   root.render(
//     <StrictMode>
//       <TanstackQuery.Provider>
//         <AuthProvider>
//           <App />
//         </AuthProvider>
//       </TanstackQuery.Provider>
//     </StrictMode>,
//   )
// }
//
// // If you want to start measuring performance in your app, pass a function
// // to log results (for example: reportWebVitals(console.log))
// // or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals()


import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";
import {AuthProvider} from "@/lib/auth/auth-provider";
import {App} from "@/app";
import * as TanstackQuery from './integrations/tanstack-query/root-provider'
import {Toaster} from "@/components/ui/sonner";


createRoot(document.getElementById("app")!).render(
  // <StrictMode>
  <TanstackQuery.Provider>
    <AuthProvider>
      <App />
      <Toaster />
    </AuthProvider>
  </TanstackQuery.Provider>
  // </StrictMode>,
);
