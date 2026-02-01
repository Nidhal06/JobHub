export function getApiBase(): string {
    // Try window.__env (common pattern), then a meta tag, then fallback to environment-like variable
    const win = (window as any);
    const normalize = (u: string) => u.replace(/\/+$/, '');

    if (win && win.__env && typeof win.__env.API_URL === 'string' && win.__env.API_URL.length > 0) {
        const base = normalize(win.__env.API_URL);
        return base.endsWith('/api') || base.includes('/api/') ? base : base + '/api';
    }

    // <meta name="api-base" content="https://api.example.com">
    try {
        const meta = document.querySelector('meta[name="api-base"]') as HTMLMetaElement | null;
        if (meta && meta.content) {
            const base = normalize(meta.content);
            return base.endsWith('/api') || base.includes('/api/') ? base : base + '/api';
        }
    } catch (e) {
        // ignore
    }

    // Fallback to relative API path (Netlify proxy or same origin)
    return '/api';
}
