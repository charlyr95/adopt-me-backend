import { env } from './env.config.js';

export const corsConfig = {
    origin: parseOrigins(env.CORS_ORIGIN),
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: env.CORS_ORIGIN.includes("*") ? false : true
};

function parseOrigins(origins) {
    if (typeof origins === 'string') {
        if (origins.includes("*")) return "*";
        return origins.split(',').map(origin => origin.trim());
    }
    return origins;
}