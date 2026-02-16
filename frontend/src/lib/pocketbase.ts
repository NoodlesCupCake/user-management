import PocketBase from "pocketbase";

const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_URL || "http://127.0.0.1:8090");

// Disable auto-cancellation so concurrent requests don't cancel each other
pb.autoCancellation(false);

export default pb;
