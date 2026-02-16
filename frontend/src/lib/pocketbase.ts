import PocketBase from "pocketbase";

// Robust URL detection for different environments
const getBaseUrl = () => {
    // If explicitly provided via env (e.g. during build or specialized deploy)
    if (process.env.NEXT_PUBLIC_POCKETBASE_URL) {
        return process.env.NEXT_PUBLIC_POCKETBASE_URL;
    }

    if (typeof window !== "undefined") {
        const port = window.location.port;
        // Port 80, 443 or empty means we are likely behind the Nginx gateway
        if (port === "" || port === "80" || port === "443") {
            return window.location.origin;
        }
        // Fallback for local dev when frontend and backend are on different ports
        // We use 127.0.0.1 to avoid some localhost resolution issues in some environments
        return "http://127.0.0.1:8090";
    }

    // SSR / Docker Internal
    // "pocketbase" is the service name in docker-compose.yml
    return "http://pocketbase:8090";
};

const pb = new PocketBase(getBaseUrl());

// Disable auto-cancellation for async requests
pb.autoCancellation(false);

export default pb;
