import Redis from 'ioredis';
import dotenv from 'dotenv';
dotenv.config();


const connectionOpts = {
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  password: process.env.REDIS_PASSWORD || undefined,

};
const redis = new Redis(connectionOpts);

const pub = new Redis(connectionOpts);

const sub = new Redis(connectionOpts);

export { redis, pub, sub };
