// cache.ts
import NodeCache from 'node-cache';

export const myCache = new NodeCache({ stdTTL: 3600 }); // TTL of 1 hour (in seconds)
