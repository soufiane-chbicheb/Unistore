import '../css/app.css';
import './bootstrap.js';
import '../../i18n';
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import StoreConfigProvider from '@/contextProvoders/StoreConfigProvider';
import { AdminThemeProvider } from '@/contextProvoders/AdminThemeProvider';
import { ToastProvider } from '@/contextProvoders/ToastProvider';
import { route } from 'ziggy-js';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: async (name) => {
        const pages = import.meta.glob('./Pages/**/*.{tsx,jsx}');
        const nameLower = name.toLowerCase().replace(/\\/g, '/');
        const key = Object.keys(pages).find(k => k.toLowerCase().replace('./pages/', '').replace(/\.(tsx|jsx)$/, '') === nameLower);

        if (!key) {
            throw new Error(`Page not found: ${name}`);
        }
        
        // Wrap in a retry mechanism to handle Vite dev server flakiness
        try {
            return await resolvePageComponent(key, pages);
        } catch (error) {
            console.warn(`Initial fetch failed for ${name}, retrying...`, error);
            // If it's a network error, try one more time after a short delay
            await new Promise(resolve => setTimeout(resolve, 500));
            return resolvePageComponent(key, pages);
        }
    },
    setup({ el, App, props }) {
        const root = createRoot(el);
        const storeConfigs = props.initialPage.props.storeConfigs;

        // @ts-ignore
        const ziggyConfig = props.initialPage.props.ziggy;
        if (ziggyConfig) {
            // @ts-ignore
            window.route = (name, params, absolute, config = ziggyConfig) => route(name, params, absolute, config);
        }

        root.render(   
            <StoreConfigProvider initialStoreConfigs={storeConfigs}>
                <AdminThemeProvider initialStoreConfigs={storeConfigs}>
                    <ToastProvider>
                        <App {...props} />
                    </ToastProvider>
                </AdminThemeProvider>
            </StoreConfigProvider>
         );
    }
   ,
    progress: {
        color: '#006affff',
    },
});
