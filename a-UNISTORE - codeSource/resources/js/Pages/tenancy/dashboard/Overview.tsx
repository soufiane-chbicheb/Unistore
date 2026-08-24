import React from 'react';
import { Head } from '@inertiajs/react';
import TenancyLayout from '@/Layouts/tenancy/TenancyLayout';
import AdminLayout from '@/Layouts/tenancy/AdminLayout';

const Dashboard = () => {
    return (
        <>
            <Head title="Tenancy Dashboard" />
            <>overview</>
        </>
    );
};

Dashboard.layout = (page: React.ReactNode) => (
    <TenancyLayout>
        <AdminLayout>{page}</AdminLayout>
    </TenancyLayout>
);

export default Dashboard;
