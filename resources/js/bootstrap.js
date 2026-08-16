import axios from 'axios';

window.axios = axios;

window.axios.defaults.withCredentials = true;
window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

// Don't set X-CSRF-TOKEN statically here — the interceptor handles it

// Always read the token fresh from the DOM right before each request
window.axios.interceptors.request.use(config => {
    const token = document.querySelector('meta[name="csrf-token"]');
    if (token) {
        config.headers['X-CSRF-TOKEN'] = token.getAttribute('content');
    }
    return config;
});

// If Laravel still returns 419, the meta tag itself is stale — refresh it then retry once
window.axios.interceptors.response.use(
    response => response,
    async error => {
        const status = error.response?.status;
        const isRetry = error.config?._retry;

        if (status === 419 && !isRetry) {
            error.config._retry = true;

            // Re-fetch a fresh CSRF cookie from Laravel, which also updates the session
            await window.axios.get('/sanctum/csrf-cookie');

            // Now update the meta tag so future requests also get the fresh token
            const freshToken = document.cookie
                .split('; ')
                .find(row => row.startsWith('XSRF-TOKEN='))
                ?.split('=')[1];

            if (freshToken) {
                const meta = document.querySelector('meta[name="csrf-token"]');
                if (meta) meta.setAttribute('content', decodeURIComponent(freshToken));
                error.config.headers['X-CSRF-TOKEN'] = decodeURIComponent(freshToken);
            }

            return window.axios.request(error.config);
        }

        return Promise.reject(error);
    }
);