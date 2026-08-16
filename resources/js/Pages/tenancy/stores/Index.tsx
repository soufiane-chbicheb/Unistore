import React from 'react';
import { Head, Link } from '@inertiajs/react';
import TenancyLayout from '@/Layouts/tenancy/TenancyLayout';
import AdminLayout from '@/Layouts/tenancy/AdminLayout';
import { Plus, Search, MoreVertical } from 'lucide-react';

const StoresIndex = () => {
    return (
        <>
            <Head title="Manage Stores" />
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900">Stores</h2>
                        <p className="text-slate-600">Overview of all active and pending stores.</p>
                    </div>
                    <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors">
                        <Plus className="w-4 h-4 mr-2" />
                        Create Store
                    </button>
                </div>

                <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
                    <div className="p-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input 
                                type="text" 
                                placeholder="Search stores..." 
                                className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
                            />
                        </div>
                    </div>
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200">
                                <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Store Name</th>
                                <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Slug</th>
                                <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                            {[
                                { name: 'Fashion Hub', slug: 'fashion-hub', status: 'Active' },
                                { name: 'Tech Store', slug: 'tech-store', status: 'Active' },
                                { name: 'Gadget World', slug: 'gadget-world', status: 'Pending' },
                            ].map((store) => (
                                <tr key={store.slug} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4 text-sm font-medium text-slate-900">{store.name}</td>
                                    <td className="px-6 py-4 text-sm text-slate-600">{store.slug}</td>
                                    <td className="px-6 py-4 text-sm">
                                        <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                                            store.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                                        }`}>
                                            {store.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-right">
                                        <button className="text-slate-400 hover:text-slate-600">
                                            <MoreVertical className="w-5 h-5" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
};

StoresIndex.layout = (page: React.ReactNode) => (
    <TenancyLayout>
        <AdminLayout>{page}</AdminLayout>
    </TenancyLayout>
);

export default StoresIndex;
