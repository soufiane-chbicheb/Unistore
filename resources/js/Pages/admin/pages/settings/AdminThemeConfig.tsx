import React from "react";
import { AdminLayout } from "@/admin/components/layout/AdminLayout";
import ThemeConfig from "./configStore/themeConfig/ThemeConfig";
import { useTheme } from "@/contextHooks/useTheme";

export const AdminThemeConfig = () => {
    const { theme: currentTheme } = useTheme();

    return (
        <div className="p-6 h-full overflow-auto" style={{ background: currentTheme.bg, color: currentTheme.text }}>
            <h1 className="text-2xl font-bold mb-6">Admin Appearance Settings</h1>
            <ThemeConfig contextType="admin" />
        </div>
    );
};

AdminThemeConfig.layout = (page: any) => <AdminLayout children={page} />;
export default AdminThemeConfig;
