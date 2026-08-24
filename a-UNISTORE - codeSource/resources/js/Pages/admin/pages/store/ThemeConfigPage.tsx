import React from "react";
import { AdminLayout } from "@/admin/components/layout/AdminLayout";
import ThemeConfig from "../settings/configStore/themeConfig/ThemeConfig";
import { useTheme } from "@/contextHooks/useTheme";

export const ThemeConfigPage = () => {
    const { theme: currentTheme } = useTheme();

    return (
        <div className="p-6 h-full overflow-auto" style={{ background: currentTheme.bg, color: currentTheme.text }}>
            <h1 className="text-2xl font-bold mb-2">Store Theme</h1>
            <p className="opacity-60 mb-6 border-b pb-4" style={{ borderColor: currentTheme.border }}>
                Select and customize the global theme for your store.
            </p>
            <ThemeConfig contextType="store" />
        </div>
    );
};

ThemeConfigPage.layout = (page: any) => <AdminLayout children={page} />;
export default ThemeConfigPage;

