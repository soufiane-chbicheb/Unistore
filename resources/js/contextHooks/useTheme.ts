import { useContext } from "react";
import { AdminThemeContext } from "@/context/AdminThemeContext";
import { StoreConfigContext } from "@/context/StoreConfigContext";

export const useTheme = () => {
    const adminCtx = useContext(AdminThemeContext);
    const storeCtx = useContext(StoreConfigContext);

    // If we are within AdminThemeProvider, use its theme
    if (adminCtx) {
        return {
            theme: adminCtx.state.currentTheme,
            themeMode: adminCtx.state.currentThemeMode,
            themeStyle: adminCtx.state.currentThemeStyle,
            dispatch: adminCtx.dispatch,
            contextType: 'admin' as const
        };
    }

    // Otherwise, use the Store theme
    if (storeCtx) {
        return {
            theme: storeCtx.state.currentTheme,
            themeMode: storeCtx.state.currentThemeMode,
            themeStyle: storeCtx.state.currentThemeStyle,
            dispatch: storeCtx.dispatch,
            contextType: 'store' as const
        };
    }

    throw new Error("useTheme must be used within either AdminThemeProvider or StoreConfigProvider");
};
