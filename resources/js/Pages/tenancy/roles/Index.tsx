import React from 'react';
import { Head } from '@inertiajs/react';
import TenancyLayout from '@/Layouts/tenancy/TenancyLayout';
import AdminLayout from '@/Layouts/tenancy/AdminLayout';
import { Shield, Plus } from 'lucide-react';

const RolesIndex = () => {
    return (
        <>
            <Head title="Manage Roles" />
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900">Roles & Permissions</h2>
                        <p className="text-slate-600">Define access levels for store administrators.</p>
                    </div>
                    <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors">
                        <Plus className="w-4 h-4 mr-2" />
                        Create Role
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[
                        { name: 'Super Admin', description: 'Full access to all stores and settings.', count: 3 },
                        { name: 'Store Manager', description: 'Can manage store products, orders and settings.', count: 12 },
                        { name: 'Support Agent', description: 'Can view orders and handle customer queries.', count: 25 },
                    ].map((role) => (
                        <div key={role.name} className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm flex flex-col">
                            <div className="flex items-center mb-4">
                                <div className="p-2 bg-blue-50 rounded-lg">
                                    <Shield className="w-6 h-6 text-blue-600" />
                                </div>
                                <h3 className="ml-3 text-lg font-bold text-slate-900">{role.name}</h3>
                            </div>
                            <p className="text-sm text-slate-600 mb-6 flex-grow">{role.description}</p>
                            <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                                <span className="text-xs font-medium text-slate-500">{role.count} Users assigned</span>
                                <button className="text-blue-600 text-sm font-semibold hover:text-blue-700">Edit Permissions</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};

RolesIndex.layout = (page: React.ReactNode) => (
    <TenancyLayout>
        <AdminLayout>{page}</AdminLayout>
    </TenancyLayout>
);

export default RolesIndex;
