export function getApiBase(): string {
    // Try window.__env (common pattern), then a meta tag, then fallback to environment-like variable
    const win = (window as any);
    if (win && win.__env && typeof win.__env.API_URL === 'string' && win.__env.API_URL.length > 0) {
        return win.__env.API_URL.replace(/\/+$/, '');
    }

    // <meta name="api-base" content="https://api.example.com">
    try {
        const meta = document.querySelector('meta[name="api-base"]') as HTMLMetaElement | null;
        if (meta && meta.content) {
            return meta.content.replace(/\/+$/, '');
        }
    } catch (e) {
        // ignore
    }

    // Fallback to relative API path
    return '';
}
