import React, { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { 
    LogOut, 
    Menu,
    ChevronRight,
    ChevronDown,
    Search
} from 'lucide-react';
import { tenancyNavigationLinks } from '@/admin/data/tenancyNavigationLinks';

interface AdminLayoutProps {
    children: React.ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
    const { url } = usePage();
    const [openMenus, setOpenMenus] = useState<string[]>([]);

    const toggleMenu = (title: string) => {
        setOpenMenus(prev => 
            prev.includes(title) 
                ? prev.filter(t => t !== title) 
                : [...prev, title]
        );
    };

    return (
        <div className="flex h-screen overflow-hidden bg-white">
            {/* Sidebar */}
            <aside className="hidden md:flex md:flex-shrink-0">
                <div className="flex flex-col w-64 border-r border-slate-200 bg-white">
                    <div className="flex items-center h-16 px-6 border-b border-slate-200">
                        <span className="text-xl font-bold text-blue-600">UniStore Tenancy</span>
                    </div>
                    <div className="flex flex-col flex-1 overflow-y-auto">
                        <nav className="flex-1 px-4 py-4 space-y-4">
                            {tenancyNavigationLinks.map((item, idx) => {
                                if (item.section) {
                                    return (
                                        <div key={`section-${idx}`} className="px-3 pt-4 pb-2">
                                            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                                {item.sectionTitle}
                                            </p>
                                        </div>
                                    );
                                }

                                const hasSubLinks = item.subLinks && item.subLinks.length > 0;
                                const isOpen = openMenus.includes(item.title);
                                const isActive = item.href ? url.startsWith(item.href) : false;

                                return (
                                    <div key={item.title} className="space-y-1">
                                        <button
                                            onClick={() => hasSubLinks && toggleMenu(item.title)}
                                            className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                                                isActive 
                                                    ? 'bg-blue-50 text-blue-600' 
                                                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                                            }`}
                                        >
                                            <item.icon className={`mr-3 h-5 w-5 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                                            <span className="flex-1 text-left">{item.title}</span>
                                            {hasSubLinks && (
                                                isOpen ? <ChevronDown className="ml-auto h-4 w-4" /> : <ChevronRight className="ml-auto h-4 w-4" />
                                            )}
                                        </button>

                                        {hasSubLinks && isOpen && (
                                            <div className="ml-8 space-y-1">
                                                {item.subLinks?.map((sub) => {
                                                    const isSubActive = url.includes(sub.href);
                                                    return (
                                                        <Link
                                                            key={sub.title}
                                                            href={sub.href.includes('.') ? '#' : sub.href} // Temporary fix for route names vs paths
                                                            className={`flex items-center px-3 py-2 text-xs font-medium rounded-md transition-colors ${
                                                                isSubActive 
                                                                    ? 'text-blue-600 bg-blue-50/50' 
                                                                    : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                                                            }`}
                                                        >
                                                            <sub.icon className="mr-3 h-4 w-4" />
                                                            {sub.title}
                                                        </Link>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </nav>
                    </div>
                    <div className="flex-shrink-0 p-4 border-t border-slate-200">
                        <Link
                            href="/logout"
                            method="post"
                            as="button"
                            className="flex items-center w-full px-3 py-2 text-sm font-medium text-slate-600 rounded-md hover:bg-slate-50 hover:text-slate-900 transition-colors"
                        >
                            <LogOut className="mr-3 h-5 w-5 text-slate-400" />
                            Logout
                        </Link>
                    </div>
                </div>
            </aside>

            {/* Main content */}
            <div className="flex flex-col flex-1 w-0 overflow-hidden">
                <header className="relative z-10 flex flex-shrink-0 h-16 bg-white border-b border-slate-200">
                    <button className="px-4 text-slate-500 md:hidden">
                        <Menu className="h-6 w-6" />
                    </button>
                    <div className="flex justify-between flex-1 px-4 sm:px-6 lg:px-8">
                        <div className="flex flex-1 items-center">
                            <h1 className="text-lg font-semibold text-slate-900">Tenancy Admin</h1>
                        </div>
                        <div className="flex items-center ml-4 md:ml-6">
                            <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
                                    A
                                </div>
                                <span className="text-sm font-medium text-slate-700">Admin User</span>
                            </div>
                        </div>
                    </div>
                </header>

                <main className="relative flex-1 overflow-y-auto focus:outline-none bg-slate-50">
                    <div className="py-6">
                        <div className="px-4 mx-auto max-w-7xl sm:px-6 md:px-8">
                            {children}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
