import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Search, ChevronDown, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/use-auth";

const Header = () => {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user } = useAuth();

  const isActive = (path: string) => location === path;

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <span className="text-2xl font-bold text-primary">
                FULL<span className="text-accent">SCO</span>
              </span>
            </Link>
            
            {/* Desktop Navigation */}
            <nav className="ml-10 hidden space-x-8 md:flex">
              <Link href="/">
                <a className={`px-3 py-2 text-sm font-medium ${isActive('/') ? 'text-primary' : 'text-gray-900 hover:text-primary'}`}>
                  Home
                </a>
              </Link>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center px-3 py-2 text-sm font-medium text-gray-900 hover:text-primary">
                    Scholarships <ChevronDown className="ml-1 h-4 w-4" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem asChild>
                    <Link href="/scholarships?level=bachelor">
                      <a className="w-full">Undergraduate</a>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/scholarships?level=masters">
                      <a className="w-full">Masters</a>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/scholarships?level=phd">
                      <a className="w-full">PhD</a>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/scholarships?funded=true">
                      <a className="w-full">Full Funding</a>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/scholarships">
                      <a className="w-full">By Country</a>
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              
              <Link href="/articles">
                <a className={`px-3 py-2 text-sm font-medium ${isActive('/articles') ? 'text-primary' : 'text-gray-900 hover:text-primary'}`}>
                  Resources
                </a>
              </Link>
              
              <Link href="/success-stories">
                <a className={`px-3 py-2 text-sm font-medium ${isActive('/success-stories') ? 'text-primary' : 'text-gray-900 hover:text-primary'}`}>
                  Success Stories
                </a>
              </Link>
              
              <Link href="/about">
                <a className={`px-3 py-2 text-sm font-medium ${isActive('/about') ? 'text-primary' : 'text-gray-900 hover:text-primary'}`}>
                  About
                </a>
              </Link>
              
              <Link href="/contact">
                <a className={`px-3 py-2 text-sm font-medium ${isActive('/contact') ? 'text-primary' : 'text-gray-900 hover:text-primary'}`}>
                  Contact
                </a>
              </Link>
            </nav>
          </div>
          
          <div className="flex items-center">
            <div className="hidden md:block">
              <div className="relative">
                <Input 
                  type="text" 
                  placeholder="Search scholarships..." 
                  className="w-64 py-1.5 pl-10 pr-3" 
                />
                <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
              </div>
            </div>
            
            <div className="ml-4 flex items-center md:ml-6">
              {user ? (
                <Link href="/admin">
                  <Button className="hidden sm:block">Dashboard</Button>
                </Link>
              ) : (
                <Link href="/admin/login">
                  <Button variant="outline" className="hidden sm:block">
                    Sign In
                  </Button>
                </Link>
              )}
              
              <Link href="/subscribe">
                <Button variant="accent" className="ml-3">
                  Subscribe
                </Button>
              </Link>
              
              {/* Mobile menu button */}
              <Button
                variant="ghost"
                size="icon"
                className="ml-3 md:hidden"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                <Menu className="h-6 w-6" />
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile menu, show/hide based on menu state */}
      {mobileMenuOpen && (
        <div className="md:hidden">
          <div className="space-y-1 px-2 pb-3 pt-2">
            <Link href="/">
              <a className="block rounded-md px-3 py-2 text-base font-medium text-gray-900 hover:bg-gray-100">
                Home
              </a>
            </Link>
            <Link href="/scholarships">
              <a className="block rounded-md px-3 py-2 text-base font-medium text-gray-900 hover:bg-gray-100">
                Scholarships
              </a>
            </Link>
            <Link href="/articles">
              <a className="block rounded-md px-3 py-2 text-base font-medium text-gray-900 hover:bg-gray-100">
                Resources
              </a>
            </Link>
            <Link href="/success-stories">
              <a className="block rounded-md px-3 py-2 text-base font-medium text-gray-900 hover:bg-gray-100">
                Success Stories
              </a>
            </Link>
            <Link href="/about">
              <a className="block rounded-md px-3 py-2 text-base font-medium text-gray-900 hover:bg-gray-100">
                About
              </a>
            </Link>
            <Link href="/contact">
              <a className="block rounded-md px-3 py-2 text-base font-medium text-gray-900 hover:bg-gray-100">
                Contact
              </a>
            </Link>
          </div>
          <div className="border-t border-gray-200 pt-4 pb-3">
            <div className="flex items-center px-4">
              <div className="flex-shrink-0">
                {user ? (
                  <Link href="/admin">
                    <Button>Dashboard</Button>
                  </Link>
                ) : (
                  <Link href="/admin/login">
                    <Button variant="outline">Sign in</Button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
