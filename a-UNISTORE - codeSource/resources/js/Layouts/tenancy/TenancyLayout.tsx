import React from 'react';
import { Head } from '@inertiajs/react';
import { ToastProvider } from '@/contextProvoders/ToastProvider';

interface TenancyLayoutProps {
    children: React.ReactNode;
}

const TenancyLayout = ({ children }: TenancyLayoutProps) => {
    return (
        <ToastProvider>
            <Head>
                <title>Tenancy Management</title>
            </Head>
            <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
                {children}
            </div>
        </ToastProvider>
    );
};

export default TenancyLayout;
