import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Store, Rocket, ArrowRight, Flower, Globe, Zap, Shield, LogOut, User } from 'lucide-react';

interface Props {
    auth: {
        user: {
            id: number;
            name: string;
            email: string;
        } | null;
    }
}

export default function TenancyHome({ auth }: Props) {
    return (
        <div className="min-h-screen bg-white font-sans text-gray-900">
            <Head title="Start Your Business - MicroMarket" />

            {/* Simple Navbar */}
            <nav className="px-6 py-6 flex items-center justify-between max-w-7xl mx-auto">
                <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-blue-600 text-white">
                        <Flower size={24} />
                    </div>
                    <span className="text-xl font-bold tracking-tight text-gray-900">MicroMarket</span>
                </div>
                <div className="flex items-center gap-6">
                    {auth.user ? (
                        <div className="flex items-center gap-4">
                            <div className="flex flex-col items-end">
                                <span className="text-sm font-bold text-gray-900">{auth.user.name}</span>
                                <span className="text-xs text-gray-500">{auth.user.email}</span>
                            </div>
                            <Link 
                                href="/logout" 
                                method="post" 
                                as="button"
                                className="flex items-center gap-2 bg-gray-50 text-gray-600 px-4 py-2 rounded-xl text-sm font-bold hover:bg-gray-100 transition-all border border-gray-100"
                            >
                                <LogOut size={16} />
                                Log Out
                            </Link>
                        </div>
                    ) : (
                        <>
                            <Link href="/login" className="text-sm font-bold text-gray-600 hover:text-gray-900 transition-colors">Log In</Link>
                            <Link 
                                href="/register" 
                                className="bg-gray-900 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-black transition-all shadow-lg shadow-gray-200"
                            >
                                Sign Up
                            </Link>
                        </>
                    )}
                </div>
            </nav>

            {/* Hero Section */}
            <main className="max-w-7xl mx-auto px-6 pt-16 pb-24 flex flex-col items-center text-center">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="space-y-8"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-full text-sm font-bold tracking-wide uppercase">
                        <Zap size={16} />
                        <span>The Multi-Tenant Solution</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-[1.1]">
                        Launch your store <br />
                        <span className="text-blue-600">in seconds.</span>
                    </h1>

                    <p className="text-xl text-gray-500 max-w-2xl mx-auto font-medium leading-relaxed">
                        The all-in-one platform to create, manage, and scale your e-commerce empire. 
                        Get a custom domain, professional dashboard, and global reach.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                        <Link 
                            href={route('tenancy.stores.create')}
                            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-2xl text-lg font-bold hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 hover:scale-105 active:scale-95"
                        >
                            <Rocket size={20} />
                            Create Your Store
                            <ArrowRight size={20} />
                        </Link>
                        <Link 
                            href="/marketplace"
                            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white border-2 border-gray-100 text-gray-900 px-8 py-4 rounded-2xl text-lg font-bold hover:bg-gray-50 transition-all"
                        >
                            Explore Marketplace
                        </Link>
                    </div>
                </motion.div>

                {/* Features Grid */}
                <motion.div 
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2, duration: 0.8 }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-32 w-full"
                >
                    <div className="p-8 bg-gray-50 rounded-3xl space-y-4 text-left border border-gray-100">
                        <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center">
                            <Globe size={24} />
                        </div>
                        <h3 className="text-xl font-bold">Custom Domains</h3>
                        <p className="text-gray-500 font-medium">Every store gets its own unique domain or subdomain automatically.</p>
                    </div>
                    <div className="p-8 bg-gray-50 rounded-3xl space-y-4 text-left border border-gray-100">
                        <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center">
                            <Store size={24} />
                        </div>
                        <h3 className="text-xl font-bold">Admin Dashboard</h3>
                        <p className="text-gray-500 font-medium">A powerful CRM to manage products, orders, and customers in one place.</p>
                    </div>
                    <div className="p-8 bg-gray-50 rounded-3xl space-y-4 text-left border border-gray-100">
                        <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center">
                            <Shield size={24} />
                        </div>
                        <h3 className="text-xl font-bold">Secure Isolation</h3>
                        <p className="text-gray-500 font-medium">Your data is safely isolated from other stores using our multi-tenant tech.</p>
                    </div>
                </motion.div>
            </main>

            <footer className="max-w-7xl mx-auto px-6 py-12 border-t border-gray-100 text-center text-sm font-bold text-gray-300 tracking-widest uppercase">
                &copy; {new Date().getFullYear()} MicroMarket Multi-Tenant Platform
            </footer>
        </div>
    );
}
