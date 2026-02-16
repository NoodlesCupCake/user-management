import PocketBase from "pocketbase";

const getPocketBaseUrl = () => {
    // 1. Explicit environment variable (if set at build time)
    if (process.env.NEXT_PUBLIC_POCKETBASE_URL) {
        return process.env.NEXT_PUBLIC_POCKETBASE_URL;
    }

    // 2. Browser inference
    if (typeof window !== "undefined") {
        const port = window.location.port;
        // If we're on the gateway (port 80) or potentially another proxy (port empty),
        // we use the current origin to talk to the API.
        if (port === "" || port === "80" || port === "443") {
            return window.location.origin;
        }

        // If we are on standard Next.js dev ports (3000, 3001), 
        // fallback to the default local PocketBase address.
        if (port === "3000" || port === "3001") {
            return "http://127.0.0.1:8090";
        }

        // Default to origin for any other case in the browser
        return window.location.origin;
    }

    // 3. Server-side (fallback for Docker SSR or build-time)
    // Use the internal Docker network name if possible
    return "http://pocketbase:8090";
};

const pb = new PocketBase(getPocketBaseUrl());

if (typeof window !== "undefined") {
    console.log("[PocketBase] Initialized at:", pb.baseUrl);
}

// Disable auto-cancellation so concurrent requests don't cancel each other
pb.autoCancellation(false);

export default pb;
