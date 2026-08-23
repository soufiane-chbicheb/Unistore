import React from "react";
import { AdminLayout } from "@/admin/components/layout/AdminLayout";
import CardsConfig from "../settings/configStore/cardsConfig/Components/CardsConfig";
import { useTheme } from "@/contextHooks/useTheme";

export const CardsConfigPage = () => {
    const { theme: currentTheme } = useTheme();

    return (
        <div className="h-full flex flex-col overflow-hidden" style={{ background: currentTheme.bg, color: currentTheme.text }}>
            <div className="flex-1 overflow-hidden">
                <CardsConfig />
            </div>
        </div>
    );
};

CardsConfigPage.layout = (page: any) => <AdminLayout children={page} />;
export default CardsConfigPage;

