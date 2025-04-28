import { ChevronDown, Settings, Search, Menu } from 'lucide-react';
import {
  Avatar,
  AvatarFallback,
  AvatarImage
} from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const DashboardHeader = () => {
  return (
    <header className="bg-white border-b border-gray-200 px-4 py-2 z-50">
      <div className="flex items-center justify-between">
        {/* Left side: Organization and Project */}
        <div className="flex items-center space-x-2">
          {/* Organization logo and dropdown */}
          <div className="flex items-center">
            <Avatar className="h-8 w-8 mr-2 bg-gray-800 text-white">
              <AvatarFallback>P</AvatarFallback>
            </Avatar>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="px-2 font-medium flex items-center gap-1">
                  Pixelmind Studio
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>Personal</DropdownMenuItem>
                <DropdownMenuItem>Team Space</DropdownMenuItem>
                <DropdownMenuItem>Enterprise</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Create Organization</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="text-gray-300">/</div>

          {/* Project dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="px-2 font-medium flex items-center gap-1">
                Default project
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>Project 1</DropdownMenuItem>
              <DropdownMenuItem>Project 2</DropdownMenuItem>
              <DropdownMenuItem>Project 3</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Create New Project</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Right side: Main Navigation */}
        <div className="flex items-center space-x-4">
          <nav className="hidden md:flex items-center space-x-6">
            <a href="#" className="text-sm text-gray-500 hover:text-gray-900">Playground</a>
            <a href="#" className="text-sm text-gray-500 hover:text-gray-900">Dashboard</a>
            <a href="#" className="text-sm text-gray-700 font-medium hover:text-gray-900">Docs</a>
            <a href="#" className="text-sm text-gray-500 hover:text-gray-900">API reference</a>
          </nav>

          <Button variant="ghost" size="icon" className="text-gray-500">
            <Settings className="h-5 w-5" />
          </Button>

          <Avatar className="h-8 w-8 bg-indigo-600 text-white">
            <AvatarFallback>M</AvatarFallback>
          </Avatar>
        </div>
      </div>

      {/* Search bar - Separate row */}
      <div className="relative max-w-xs mt-2 md:hidden">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
        <Input
          type="search"
          placeholder="Search"
          className="pl-8 h-9 text-sm w-full bg-gray-50"
        />
        <span className="absolute right-2 top-2 text-xs text-gray-400 bg-gray-100 px-1 rounded">⌘ K</span>
      </div>
    </header>
  );
};

export default DashboardHeader;