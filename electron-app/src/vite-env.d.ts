/// <reference types="vite/client" />

interface Window {
    api: {
        loadData: () => Promise<any[]>;
    };
}
