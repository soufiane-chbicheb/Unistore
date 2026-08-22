import React, { useState } from 'react';
import '../../css/main.css';
import '../../css/util.css';

import {
  Search,
  ShoppingCart,
  Heart,
  Menu,
  X,
  ChevronRight,
  Facebook,

  ChevronUp,
  Instagram,
  Twitter,
  User,
  LogOut,
  LayoutDashboard,
  UserCircle
} from 'lucide-react';
import { Head, Link, usePage } from '@inertiajs/react';
import CartSideBar from '@/Pages/cart/cartlisting/CartSideBar';
import StoreConfigProvider from '@/contextProvoders/StoreConfigProvider';
import { ToastProvider } from '@/contextProvoders/ToastProvider';
import { useToast } from '@/contextHooks/useToasts';
import { useEffect } from 'react';
import { useStoreConfigCtx } from '@/contextHooks/useStoreConfigCtx';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { getInitials } from '@/admin/utils/helpers';


interface LayoutProps {
  children: React.ReactNode
  currentPage: string;
  seo: {
    title: string,
    description: string
  }
}

const Layout = ({ children, currentPage = 'home', seo }: LayoutProps) => {
  return (
    <ToastProvider>
      <StoreConfigProvider >
        <LayoutContent {...{ children, currentPage, seo }} />
      </StoreConfigProvider>
    </ToastProvider>
  )
}

const LayoutContent = ({ children, currentPage, seo }: LayoutProps) => {
  const { props } = usePage();
  const { flash, cartCount, cartItems: sharedCartItems, auth, storeCurrency } = props as any;
  const { addToast } = useToast();
  
  const { state: { currentTheme: theme } } = useStoreConfigCtx();
  
  // Debug log to help identify if auth is missing or just the user is null
  useEffect(() => {
    console.log("Inertia Page Props:", props);
    console.log("Auth Object:", auth);
  }, [props, auth]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    if (flash?.success) {
      addToast({
        type: 'success',
        title: 'Success',
        description: flash.success
      });
    }
    if (flash?.error) {
      addToast({
        type: 'error',
        title: 'Error',
        description: flash.error
      });
    }
    if (flash?.errors?.error) {
      addToast({
        type: 'error',
        title: 'Error',
        description: flash.errors.error
      });
    }
  }, [flash]);

  const navigation = [
    { name: 'Home', href: '/', active: currentPage === 'home' },
    { name: 'Shop', href: '/marketplace', active: currentPage === 'shop' },
    { name: 'Features', href: '/features', active: currentPage === 'cart', label: 'hot' },
    { name: 'Blog', href: '/blog', active: currentPage === 'blog' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact', submenu: ['Email', 'Phone'] }
  ];

  const total = (sharedCartItems || []).reduce((sum, item) => sum + (item.price_snapshot * item.quantity), 0);

  return (<>
    {/* header and meta data for seo */}
    <Head>
      <title>{seo?.title || 'Default Store Title'}</title>
      <meta name="description" content={seo?.description || 'Default description'} />
    </Head>

    {/* main page content */}
    <div className="min-h-screen" style={{ backgroundColor: theme.bg }}>
      {/* Header */}
      <header className="relative z-50">
        {/* Top Bar */}
        <div className="border-b" style={{ backgroundColor: theme.bgSecondary, borderColor: theme.header.border }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-10 text-sm">
              <div style={{ color: theme.textSecondary }}>
                Free shipping for standard order over 100 {storeCurrency}
              </div>
              <div className="hidden md:flex space-x-6" style={{ color: theme.textSecondary }}>
                <a href="#" className="transition-colors hover:opacity-80">Help & FAQs</a>
                {auth?.user ? (
                  <div className="flex items-center gap-4">
                    <span style={{ color: theme.textMuted }}>Welcome, {auth.user.name}</span>
                  </div>
                ) : (
                  <>
                    <Link href={'/login'} className="transition-colors hover:opacity-80">Login</Link>
                    <Link href={'/register'} className="transition-colors hover:opacity-80">Register</Link>
                  </>
                )}
                <a href="#" className="transition-colors hover:opacity-80">EN</a>
                <a href="#" className="transition-colors hover:opacity-80">USD</a>
              </div>
            </div>
          </div>
        </div>

        {/* Main Header */}
        <div className="shadow-sm border-b" style={{ backgroundColor: theme.header.bg, borderColor: theme.header.border }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              {/* Logo */}
              <div className="flex-shrink-0">
                <Link href="/" className="text-2xl font-bold" style={{ color: theme.header.text }}>
                  UniStore
                </Link>
              </div>

              {/* Desktop Navigation */}
              <nav className="hidden md:flex space-x-8">
                {navigation.map((item) => (
                  <div key={item.name} className="relative group">
                    <Link
                      href={item.href}
                      className={`flex items-center px-3 py-2 text-sm font-medium transition-colors`}
                      style={{
                        color: item.active ? theme.header.accent : theme.header.text,
                        borderBottom: item.active ? `2px solid ${theme.header.accent}` : 'none'
                      }}
                    >
                      {item.name}
                      {item.label && (
                        <span className="ml-2 px-2 py-0.5 text-[10px] uppercase font-bold text-white rounded-full" style={{ backgroundColor: theme.error }}>
                          {item.label}
                        </span>
                      )}
                    </Link>
                  </div>
                ))}
              </nav>

              {/* Header Icons */}
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setIsSearchOpen(true)}
                  className="p-2 transition-colors hover:opacity-80"
                  style={{ color: theme.header.text }}
                >
                  <Search className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setIsCartOpen(true)}
                  className="relative p-2 transition-colors hover:opacity-80"
                  style={{ color: theme.header.text }}
                >
                  <ShoppingCart className="w-5 h-5" />
                  <span className="absolute -top-1 -right-1 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center" style={{ backgroundColor: theme.header.accent }}>
                    {cartCount || 0}
                  </span>
                </button>

                {auth?.user ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="flex items-center outline-none">
                        <Avatar className="h-8 w-8 ring-2 ring-offset-2 transition-all" style={{ ringColor: theme.header.accent }}>
                          <AvatarImage src={auth.user.google_avatar || auth.user.avatar?.url} alt={auth.user.name} />
                          <AvatarFallback style={{ backgroundColor: theme.bgSecondary, color: theme.text }}>
                            {getInitials(auth.user.name)}
                          </AvatarFallback>
                        </Avatar>
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      style={{
                        backgroundColor: theme.modal,
                        color: theme.text,
                        borderColor: theme.border,
                        boxShadow: theme.shadowMd
                      }}
                      align="end"
                    >
                      <DropdownMenuLabel>
                        <div className="flex flex-col space-y-1">
                          <p className="text-sm font-medium leading-none">{auth.user.name}</p>
                          <p className="text-xs leading-none" style={{ color: theme.textMuted }}>{auth.user.email}</p>
                        </div>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator style={{ backgroundColor: theme.border }} />

                      {auth.user.roles?.some(role => role.name === 'admin' || role.name === 'super admin') && (
                        <DropdownMenuItem asChild style={{ cursor: 'pointer' }}>
                          <Link href="/admin/dashboard" className="flex items-center w-full">
                            <LayoutDashboard className="mr-2 h-4 w-4" />
                            <span>Admin Panel</span>
                          </Link>
                        </DropdownMenuItem>
                      )}

                      <DropdownMenuItem asChild style={{ cursor: 'pointer' }}>
                        <Link href="/profile" className="flex items-center w-full">
                          <UserCircle className="mr-2 h-4 w-4" />
                          <span>My Profile</span>
                        </Link>
                      </DropdownMenuItem>

                      <DropdownMenuSeparator style={{ backgroundColor: theme.border }} />

                      <DropdownMenuItem asChild style={{ cursor: 'pointer' }}>
                        <Link href="/logout" method="post" as="button" className="flex items-center w-full text-left">
                          <LogOut className="mr-2 h-4 w-4" />
                          <span>Log out</span>
                        </Link>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <div className="hidden md:flex items-center gap-3">
                    <Link
                      href="/login"
                      className="px-4 py-2 text-sm font-medium transition-all hover:opacity-80"
                      style={{ color: theme.header.text }}
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/register"
                      className="px-4 py-2 text-sm font-bold text-white rounded-lg shadow-sm transition-all hover:opacity-90 active:scale-95"
                      style={{ backgroundColor: theme.header.accent }}
                    >
                      Sign Up
                    </Link>
                  </div>
                )}

                <button
                  onClick={() => setIsMenuOpen(true)}
                  className="md:hidden p-2 transition-colors hover:opacity-80"
                  style={{ color: theme.header.text }}
                >
                  <Menu className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-[100] md:hidden">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsMenuOpen(false)} />
          <div className="fixed right-0 top-0 h-full w-80 shadow-2xl transition-transform duration-300" style={{ backgroundColor: theme.bg }}>
            <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: theme.border }}>
              <h2 className="text-lg font-semibold" style={{ color: theme.text }}>Menu</h2>
              <button
                onClick={() => setIsMenuOpen(false)}
                className="p-2 transition-colors hover:opacity-80"
                style={{ color: theme.text }}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 overflow-y-auto h-[calc(100vh-65px)]">
              <nav className="space-y-1">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="flex items-center justify-between py-3 px-4 rounded-lg transition-colors"
                    style={{
                      backgroundColor: item.active ? `${theme.header.accent}10` : 'transparent',
                      color: item.active ? theme.header.accent : theme.text
                    }}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <span className="flex items-center font-medium">
                      {item.name}
                      {item.label && (
                        <span className="ml-2 px-2 py-0.5 text-[10px] uppercase font-bold text-white rounded-full" style={{ backgroundColor: theme.error }}>
                          {item.label}
                        </span>
                      )}
                    </span>
                    <ChevronRight className="w-4 h-4 opacity-50" />
                  </Link>
                ))}
              </nav>

              <div className="mt-8 pt-8 border-t" style={{ borderColor: theme.border }}>
                {!auth?.user ? (
                  <div className="grid grid-cols-2 gap-4">
                    <Link href="/login" className="flex items-center justify-center py-2 px-4 rounded-md border text-sm font-medium transition-colors" style={{ borderColor: theme.border, color: theme.text }}>
                      Login
                    </Link>
                    <Link href="/register" className="flex items-center justify-center py-2 px-4 rounded-md text-sm font-medium text-white transition-colors" style={{ backgroundColor: theme.header.accent }}>
                      Register
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 px-4">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={auth.user.google_avatar || auth.user.avatar?.url} />
                        <AvatarFallback>{getInitials(auth.user.name)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium" style={{ color: theme.text }}>{auth.user.name}</p>
                        <p className="text-xs" style={{ color: theme.textMuted }}>{auth.user.email}</p>
                      </div>
                    </div>
                    <Link href="/logout" method="post" as="button" className="w-full flex items-center px-4 py-2 text-sm text-red-500 hover:bg-red-50 rounded-md transition-colors">
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Search Modal */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setIsSearchOpen(false)} />
          <div className="relative rounded-2xl p-8 w-full max-w-2xl shadow-2xl animate-in zoom-in-95 duration-200" style={{ backgroundColor: theme.modal }}>
            <button
              onClick={() => setIsSearchOpen(false)}
              className="absolute top-6 right-6 transition-colors hover:opacity-70"
              style={{ color: theme.textMuted }}
            >
              <X className="w-6 h-6" />
            </button>
            <div className="flex items-center border-b-2 pb-4 transition-all focus-within:border-accent" style={{ borderColor: theme.border }}>
              <Search className="w-6 h-6 mr-4" style={{ color: theme.textMuted }} />
              <input
                type="text"
                placeholder="Search products..."
                className="flex-1 outline-none text-xl bg-transparent"
                style={{ color: theme.text }}
                autoFocus
              />
            </div>
            <p className="mt-4 text-xs" style={{ color: theme.textMuted }}>Press ESC to close</p>
          </div>
        </div>
      )}

      {/* Cart Sidebar */}
      {isCartOpen && (
        <CartSideBar cartItems={sharedCartItems || []} total={total} onClose={() => setIsCartOpen(false)} />
      )}

      {/* Main Content */}
      <main className="transition-all duration-300">
        {children}
      </main>

      {/* Footer */}
      <footer style={{ backgroundColor: '#111', color: '#fff' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {/* Categories */}
            <div>
              <h3 className="text-lg font-bold mb-8 tracking-wider uppercase">Categories</h3>
              <ul className="space-y-4">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Women</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Men</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Shoes</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Watches</a></li>
              </ul>
            </div>

            {/* Help */}
            <div>
              <h3 className="text-lg font-bold mb-8 tracking-wider uppercase">Help</h3>
              <ul className="space-y-4">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Track Order</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Returns</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Shipping</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">FAQs</a></li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="text-lg font-bold mb-8 tracking-wider uppercase">Get in Touch</h3>
              <p className="text-gray-400 mb-8 text-sm leading-relaxed">
                Any questions? Let us know in store at 8th floor, 379 Hudson St, New York, NY 10018 or call us on (+1) 96 716 6879
              </p>
              <div className="flex space-x-6">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Facebook className="w-6 h-6" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Instagram className="w-6 h-6" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Twitter className="w-6 h-6" />
                </a>
              </div>
            </div>

            {/* Newsletter */}
            <div>
              <h3 className="text-lg font-bold mb-8 tracking-wider uppercase">Newsletter</h3>
              <form className="space-y-6">
                <div className="relative border-b border-gray-700 pb-2">
                  <input
                    type="email"
                    placeholder="email@example.com"
                    className="w-full bg-transparent border-none outline-none text-sm placeholder-gray-500"
                  />
                </div>
                <button className="w-full py-3 px-6 bg-white text-black text-xs font-bold uppercase tracking-widest hover:bg-gray-200 transition-colors">
                  Subscribe
                </button>
              </form>
            </div>
          </div>

          <div className="mt-16 pt-8 border-t border-gray-800 text-center">
            <p className="text-gray-500 text-xs">
              Copyright &copy; {new Date().getFullYear()} All rights reserved | This template is made with <Heart className="inline-block w-3 h-3 text-red-500 mx-1" /> by UniStore
            </p>
          </div>
        </div>
      </footer>
    </div>
  </>);
}

export default Layout;
