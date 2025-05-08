// import { useEffect, useState } from 'react'
// import { Link } from '@tanstack/react-router'
// import {
//   Bolt,
//   BookOpen,
//   CircleUserRound,
//   Layers2,
//   LogOut,
//   Menu,
//   MoveRight,
//   Pin,
//   UserPen,
//   X,
// } from 'lucide-react'
// import { Button } from '@/components/ui/button'
// import {
//   NavigationMenu,
//   NavigationMenuContent,
//   NavigationMenuItem,
//   NavigationMenuLink,
//   NavigationMenuList,
//   NavigationMenuTrigger,
// } from '@/components/ui/navigation-menu'
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuGroup,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from '@/components/ui/dropdown-menu'
//
// interface HeaderProps {
//   isAuthenticated: boolean
// }
//
// function Header({ isAuthenticated }: HeaderProps) {
//   const navigationItems = [
//     {
//       title: 'Home',
//       to: '/',
//       description: '',
//     },
//     {
//       title: 'Product',
//       description: 'Managing a small business today is already tough.',
//       items: [
//         {
//           title: 'Reports',
//           to: '/reports',
//         },
//         {
//           title: 'Statistics',
//           to: '/statistics',
//         },
//         {
//           title: 'Dashboards',
//           to: '/dashboards',
//         },
//         {
//           title: 'Recordings',
//           to: '/recordings',
//         },
//       ],
//     },
//     {
//       title: 'Company',
//       description: 'Managing a small business today is already tough.',
//       items: [
//         {
//           title: 'About us',
//           to: '/about',
//         },
//         {
//           title: 'Fundraising',
//           to: '/fundraising',
//         },
//         {
//           title: 'Investors',
//           to: '/investors',
//         },
//         {
//           title: 'Contact us',
//           to: '/contact',
//         },
//       ],
//     },
//   ]
//
//   const [isOpen, setOpen] = useState(false)
//
//   // Handle body scroll when menu is open
//   useEffect(() => {
//     if (isOpen) {
//       document.body.style.overflow = 'hidden'
//     } else {
//       document.body.style.overflow = 'unset'
//     }
//
//     // Cleanup when component unmounts
//     return () => {
//       document.body.style.overflow = 'unset'
//     }
//   }, [isOpen])
//
//   // Function to close menu
//   const handleLinkClick = () => {
//     setOpen(false)
//   }
//
//   return (
//     <>
//       <header className="w-full z-40 fixed top-0 left-0 bg-background border-b">
//         <div className="container relative mx-auto min-h-20 flex gap-4 flex-row lg:grid lg:grid-cols-3 items-center">
//           <div className="justify-start items-center gap-4 lg:flex hidden flex-row">
//             <NavigationMenu className="flex justify-start items-start">
//               <NavigationMenuList className="flex justify-start gap-4 flex-row">
//                 {navigationItems.map((item) => (
//                   <NavigationMenuItem key={item.title}>
//                     {item.to ? (
//                       <>
//                         {/*<NavigationMenuLink>*/}
//                         <Link to={item.to} onClick={handleLinkClick}>
//                           <Button variant="ghost">{item.title}</Button>
//                         </Link>
//                         {/*</NavigationMenuLink>*/}
//                       </>
//                     ) : (
//                       <>
//                         <NavigationMenuTrigger className="font-medium text-sm">
//                           {item.title}
//                         </NavigationMenuTrigger>
//                         <NavigationMenuContent className="!w-[450px] p-4">
//                           <div className="flex flex-col lg:grid grid-cols-2 gap-4">
//                             <div className="flex flex-col h-full justify-between">
//                               <div className="flex flex-col">
//                                 <p className="text-base">{item.title}</p>
//                                 <p className="text-muted-foreground text-sm">
//                                   {item.description}
//                                 </p>
//                               </div>
//                               <Button size="sm" className="mt-10">
//                                 Book a call today
//                               </Button>
//                             </div>
//                             <div className="flex flex-col text-sm h-full justify-end">
//                               {item.items?.map((subItem) => (
//                                 <Link
//                                   to={subItem.to}
//                                   key={subItem.title}
//                                   className="flex flex-row justify-between items-center hover:bg-muted py-2 px-4 rounded"
//                                 >
//                                   <span>{subItem.title}</span>
//                                   <MoveRight className="w-4 h-4 text-muted-foreground" />
//                                 </Link>
//                               ))}
//                             </div>
//                           </div>
//                         </NavigationMenuContent>
//                       </>
//                     )}
//                   </NavigationMenuItem>
//                 ))}
//               </NavigationMenuList>
//             </NavigationMenu>
//           </div>
//           <div className="flex lg:justify-center">
//             <p className="font-semibold">YapYup</p>
//           </div>
//           <div className="flex justify-end w-full gap-4">
//             {/* <Button variant="ghost" className="hidden md:inline"> */}
//             {/*     Book a demo */}
//             {/* </Button> */}
//             <div className="border-r hidden md:inline"></div>
//             <DropdownMenu>
//               <DropdownMenuTrigger asChild>
//                 <Button
//                   size="icon"
//                   variant="outline"
//                   aria-label="Open account menu"
//                 >
//                   <CircleUserRound
//                     size={16}
//                     strokeWidth={2}
//                     aria-hidden="true"
//                   />
//                 </Button>
//               </DropdownMenuTrigger>
//               <DropdownMenuContent className="max-w-64">
//                 <DropdownMenuLabel className="flex items-start gap-3">
//                   <img
//                     src="https://originui.com/avatar.jpg"
//                     alt="Avatar"
//                     width={32}
//                     height={32}
//                     className="shrink-0 rounded-full"
//                   />
//                   <div className="flex min-w-0 flex-col">
//                     <span className="truncate text-sm font-medium text-foreground">
//                       Keith Kennedy
//                     </span>
//                     <span className="truncate text-xs font-normal text-muted-foreground">
//                       k.kennedy@originui.com
//                     </span>
//                   </div>
//                 </DropdownMenuLabel>
//                 <DropdownMenuSeparator />
//                 <DropdownMenuGroup>
//                   <Link to={'/dashboard/account'}>
//                     <DropdownMenuItem>
//                       <Bolt
//                         size={16}
//                         strokeWidth={2}
//                         className="opacity-60"
//                         aria-hidden="true"
//                       />
//                       <span>Account</span>
//                     </DropdownMenuItem>
//                   </Link>
//                   <DropdownMenuItem>
//                     <Layers2
//                       size={16}
//                       strokeWidth={2}
//                       className="opacity-60"
//                       aria-hidden="true"
//                     />
//                     <span>Option 2</span>
//                   </DropdownMenuItem>
//                   <DropdownMenuItem>
//                     <BookOpen
//                       size={16}
//                       strokeWidth={2}
//                       className="opacity-60"
//                       aria-hidden="true"
//                     />
//                     <span>Option 3</span>
//                   </DropdownMenuItem>
//                 </DropdownMenuGroup>
//                 <DropdownMenuSeparator />
//                 <DropdownMenuGroup>
//                   <DropdownMenuItem>
//                     <Pin
//                       size={16}
//                       strokeWidth={2}
//                       className="opacity-60"
//                       aria-hidden="true"
//                     />
//                     <span>Option 4</span>
//                   </DropdownMenuItem>
//                   <DropdownMenuItem>
//                     <UserPen
//                       size={16}
//                       strokeWidth={2}
//                       className="opacity-60"
//                       aria-hidden="true"
//                     />
//                     <span>Option 5</span>
//                   </DropdownMenuItem>
//                 </DropdownMenuGroup>
//                 <DropdownMenuSeparator />
//                 <DropdownMenuItem>
//                   <LogOut
//                     size={16}
//                     strokeWidth={2}
//                     className="opacity-60"
//                     aria-hidden="true"
//                   />
//                   <span>Logout</span>
//                 </DropdownMenuItem>
//               </DropdownMenuContent>
//             </DropdownMenu>
//             {isAuthenticated ? (
//               <>
//                 {/*<Link to="/dashboard" onClick={handleLinkClick}>*/}
//                 {/*  <Button variant="outline">Dashboard</Button>*/}
//                 {/*</Link>*/}
//                 <Link to="/dashboard/chat" onClick={handleLinkClick}>
//                   <Button variant="outline">Chat</Button>
//                 </Link>
//               </>
//             ) : (
//               <Link to="/sign-in" onClick={handleLinkClick}>
//                 <Button variant="outline">Sign in</Button>
//               </Link>
//             )}
//             {/* <Button>Get started</Button> */}
//           </div>
//           <div className="flex w-12 shrink lg:hidden items-end justify-end">
//             <Button variant="ghost" onClick={() => setOpen(!isOpen)}>
//               {isOpen ? (
//                 <X className="w-5 h-5" />
//               ) : (
//                 <Menu className="w-5 h-5" />
//               )}
//             </Button>
//             {isOpen && (
//               <div className="absolute top-20 border-t flex flex-col w-full right-0 bg-background shadow-lg py-8 container gap-8">
//                 {navigationItems.map((item) => (
//                   <div key={item.title} className="space-y-4">
//                     <div className="flex flex-col gap-4">
//                       {item.to ? (
//                         <Link
//                           to={item.to}
//                           onClick={handleLinkClick}
//                           className="flex justify-between items-center px-4 py-2 hover:bg-muted rounded-md"
//                         >
//                           <span className="text-lg font-medium">
//                             {item.title}
//                           </span>
//                           <MoveRight className="w-4 h-4 stroke-1 text-muted-foreground" />
//                         </Link>
//                       ) : (
//                         <div className="px-4">
//                           <p className="text-lg font-medium">{item.title}</p>
//                           {item.description && (
//                             <p className="text-sm text-muted-foreground mt-1">
//                               {item.description}
//                             </p>
//                           )}
//                         </div>
//                       )}
//                       {item.items && (
//                         <div className="pl-4 space-y-3">
//                           {item.items.map((subItem) => (
//                             <Link
//                               key={subItem.title}
//                               to={subItem.to}
//                               onClick={handleLinkClick}
//                               className="flex justify-between items-center px-4 py-2 hover:bg-muted rounded-md"
//                             >
//                               <span className="text-muted-foreground">
//                                 {subItem.title}
//                               </span>
//                               <MoveRight className="w-4 h-4 stroke-1" />
//                             </Link>
//                           ))}
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//         </div>
//       </header>
//       {/* Add a spacer div to prevent content from being hidden behind the fixed header */}
//       <div className="h-20"></div>
//     </>
//   )
// }
//
// export { Header }

import { useState, useEffect } from 'react';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger
} from '@/components/ui/navigation-menu';
import { Button } from '@/components/ui/button';
import {Link} from "@tanstack/react-router";
import {useAuthContext} from "@/lib/auth/use-auth-context";

export function Header() {
  const { isAuthenticated } = useAuthContext()

  return (
    <div className={"height-[104px] mt-8 mx-auto fixed top-0 left-0 right-0 z-50 transition-all duration-200 py-3 bg-white shadow-md rounded-[1rem] max-w-[900px]"}>
      <div className="mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <span className="text-2xl">🔥</span>
          <span className="text-xl font-bold">YapYup</span>
        </div>

        {/* Navigation - Center aligned as in screenshot */}
        <NavigationMenu className="hidden md:flex">
          <NavigationMenuList className="flex gap-8">
            <NavigationMenuItem>
              <NavigationMenuLink
                href="/dashboard"
                className="text-gray-700 hover:text-gray-900 transition-colors text-sm font-medium"
              >
                Dashboard
              </NavigationMenuLink>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuLink
                href="/docs"
                className="text-gray-700 hover:text-gray-900 transition-colors text-sm font-medium"
              >
                Docs
              </NavigationMenuLink>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuLink
                href="/pricing"
                className="text-gray-700 hover:text-gray-900 transition-colors text-sm font-medium"
              >
                Pricing
              </NavigationMenuLink>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuLink
                href="/blog"
                className="text-gray-700 hover:text-gray-900 transition-colors text-sm font-medium"
              >
                Blog
              </NavigationMenuLink>
            </NavigationMenuItem>

            {/*<NavigationMenuItem>*/}
            {/*  <NavigationMenuTrigger className="text-gray-700 hover:text-gray-900 transition-colors text-sm font-medium bg-transparent px-0 py-0">*/}
            {/*    Extract*/}
            {/*  </NavigationMenuTrigger>*/}
            {/*  <NavigationMenuContent>*/}
            {/*    <div className="grid gap-3 p-4 w-[200px]">*/}
            {/*      <NavigationMenuLink*/}
            {/*        href="/extract/option1"*/}
            {/*        className="text-gray-700 hover:text-gray-900 transition-colors text-sm p-2"*/}
            {/*      >*/}
            {/*        Option 1*/}
            {/*      </NavigationMenuLink>*/}
            {/*      <NavigationMenuLink*/}
            {/*        href="/extract/option2"*/}
            {/*        className="text-gray-700 hover:text-gray-900 transition-colors text-sm p-2"*/}
            {/*      >*/}
            {/*        Option 2*/}
            {/*      </NavigationMenuLink>*/}
            {/*      <NavigationMenuLink*/}
            {/*        href="/extract/option3"*/}
            {/*        className="text-gray-700 hover:text-gray-900 transition-colors text-sm p-2"*/}
            {/*      >*/}
            {/*        Option 3*/}
            {/*      </NavigationMenuLink>*/}
            {/*    </div>*/}
            {/*  </NavigationMenuContent>*/}
            {/*</NavigationMenuItem>*/}

            {/*<NavigationMenuItem>*/}
            {/*  <NavigationMenuTrigger className="text-gray-700 hover:text-gray-900 transition-colors text-sm font-medium bg-transparent px-0 py-0">*/}
            {/*    Resources*/}
            {/*  </NavigationMenuTrigger>*/}
            {/*  <NavigationMenuContent>*/}
            {/*    <div className="grid gap-3 p-4 w-[200px]">*/}
            {/*      <NavigationMenuLink*/}
            {/*        href="/resources/resource1"*/}
            {/*        className="text-gray-700 hover:text-gray-900 transition-colors text-sm p-2"*/}
            {/*      >*/}
            {/*        Resource 1*/}
            {/*      </NavigationMenuLink>*/}
            {/*      <NavigationMenuLink*/}
            {/*        href="/resources/resource2"*/}
            {/*        className="text-gray-700 hover:text-gray-900 transition-colors text-sm p-2"*/}
            {/*      >*/}
            {/*        Resource 2*/}
            {/*      </NavigationMenuLink>*/}
            {/*      <NavigationMenuLink*/}
            {/*        href="/resources/resource3"*/}
            {/*        className="text-gray-700 hover:text-gray-900 transition-colors text-sm p-2"*/}
            {/*      >*/}
            {/*        Resource 3*/}
            {/*      </NavigationMenuLink>*/}
            {/*    </div>*/}
            {/*  </NavigationMenuContent>*/}
            {/*</NavigationMenuItem>*/}
          </NavigationMenuList>
        </NavigationMenu>

        {/* Sign Up Button */}
        {isAuthenticated ? (
          <Link to={'/dashboard'}>
            <Button className="cursor-pointer rounded-lg bg-purple-200 text-black hover:text-black hover:bg-purple-100">
              Dashboard
            </Button>
          </Link>
        ) : (
          <Link to={'/sign-in'}>
            <Button className="cursor-pointer rounded-lg bg-white text-black hover:text-black hover:bg-gray-100 border border-gray-200 shadow-sm">
              Sign In
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
}
