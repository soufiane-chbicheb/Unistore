import React, { useState, useRef, useEffect } from "react";
import { Menu, X, User, ChevronDown, LogOut, Store, Mail, LayoutDashboard } from "lucide-react";
import { Link, usePage } from "@inertiajs/react";
const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { auth } = usePage().props as any;
  // @ts-ignore
  const route = window.route;
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="bg-saas-black bg-opacity-90 backdrop-blur-sm sticky top-0 z-50 border-b border-saas-darkGray">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0 flex items-center">
            <a href="#" className="flex items-center">
              <span className="text-2xl font-bold bg-gradient-to-r from-saas-orange to-amber-500 bg-clip-text text-transparent">
                UniStore
              </span>
            </a>
          </div>

          <div className="hidden md:block">
            <div className="flex items-center space-x-4">
              <a href="#home" className="px-3 py-2 text-sm font-medium text-white hover:text-saas-orange transition-colors">
                Home
              </a>
              <a href="#roadmap" className="px-3 py-2 text-sm font-medium text-white hover:text-saas-orange transition-colors">
                Roadmap
              </a>
              <a href="#pricing" className="px-3 py-2 text-sm font-medium text-white hover:text-saas-orange transition-colors">
                Pricing
              </a>
              <a href="#contact" className="px-3 py-2 text-sm font-medium text-white hover:text-saas-orange transition-colors">
                Contact
              </a>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-4">
            {auth.user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-black uppercase tracking-widest bg-saas-orange text-white rounded-lg transition-all hover:bg-orange-600 shadow-lg shadow-orange-500/20"
                >
                  <User size={16} />
                  {auth.user.name.split(' ')[0]}
                  <ChevronDown size={14} className={`transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-saas-darkGray border border-saas-orange/20 rounded-xl shadow-2xl py-2 z-[60] animate-in fade-in zoom-in duration-200">
                    <Link
                      href={route('dashboard.overview')}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:bg-saas-orange/10 hover:text-saas-orange transition-colors"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <LayoutDashboard size={16} />
                      Dashboard
                    </Link>
                    <Link
                      href={route('tenancy.stores.create')}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:bg-saas-orange/10 hover:text-saas-orange transition-colors"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <Store size={16} />
                      My Stores
                    </Link>
                    <a
                      href="#contact"
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:bg-saas-orange/10 hover:text-saas-orange transition-colors"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <Mail size={16} />
                      Contact
                    </a>
                    <div className="my-1 border-t border-saas-orange/10" />
                    <Link
                      href={route('logout')}
                      method="post"
                      as="button"
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <LogOut size={16} />
                      Logout
                    </Link>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  href={route('login')}
                  className="px-4 py-2 text-sm font-medium text-white hover:text-saas-orange transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href={route('tenancy.stores.create')}
                  className="px-4 py-2 text-sm font-black uppercase tracking-widest bg-saas-orange text-white rounded-lg transition-all hover:bg-orange-600 shadow-lg shadow-orange-500/20"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-white focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-saas-darkGray">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <a href="#home" className="block px-3 py-2 text-base font-medium text-white hover:text-saas-orange transition-colors" onClick={() => setIsOpen(false)}>
              Home
            </a>
            <a href="#roadmap" className="block px-3 py-2 text-base font-medium text-white hover:text-saas-orange transition-colors" onClick={() => setIsOpen(false)}>
              Roadmap
            </a>
            <a href="#pricing" className="block px-3 py-2 text-base font-medium text-white hover:text-saas-orange transition-colors" onClick={() => setIsOpen(false)}>
              Pricing
            </a>
            <a href="#contact" className="block px-3 py-2 text-base font-medium text-white hover:text-saas-orange transition-colors" onClick={() => setIsOpen(false)}>
              Contact
            </a>
            <div className="pt-4 border-t border-saas-darkGray space-y-2">
              {auth.user ? (
                <div className="flex flex-col gap-2">
                  <div className="px-3 py-2 text-xs font-black uppercase text-saas-orange border-b border-saas-orange/10 mb-1">
                    Manage Account
                  </div>
                  <Link
                    href={route('dashboard.overview')}
                    className="block w-full px-3 py-2 text-base font-medium text-white hover:text-saas-orange"
                    onClick={() => setIsOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <Link
                    href={route('tenancy.stores.create')}
                    className="block w-full px-3 py-2 text-base font-medium text-white hover:text-saas-orange"
                    onClick={() => setIsOpen(false)}
                  >
                    My Stores
                  </Link>
                  <a
                    href="#contact"
                    className="block w-full px-3 py-2 text-base font-medium text-white hover:text-saas-orange"
                    onClick={() => setIsOpen(false)}
                  >
                    Contact
                  </a>
                  <Link
                    href={route('logout')}
                    method="post"
                    as="button"
                    className="block w-full px-3 py-2 text-base font-medium text-left text-red-400 hover:bg-red-500/10"
                    onClick={() => setIsOpen(false)}
                  >
                    Logout
                  </Link>
                </div>
              ) : (
                <>
                  <Link
                    href={route('login')}
                    className="block w-full px-3 py-2 text-base font-medium text-center text-white border border-saas-darkGray rounded-md"
                    onClick={() => setIsOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link
                    href={route('tenancy.stores.create')}
                    className="block w-full px-3 py-2 text-base font-medium text-center bg-saas-orange text-white rounded-md"
                    onClick={() => setIsOpen(false)}
                  >
                    Get Started Free
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
