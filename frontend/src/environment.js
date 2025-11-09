// Use environment variable if available (for Vercel), otherwise check if we're in production
const IS_PROD = import.meta.env.PROD || import.meta.env.VITE_IS_PROD === 'true';
const server = IS_PROD 
    ? (import.meta.env.VITE_API_URL || "https://callroombackend.onrender.com")
    : "http://localhost:8000";

// Log for debugging (remove in production if needed)
if (import.meta.env.DEV) {
    console.log('API Server URL:', server);
}

export default server;