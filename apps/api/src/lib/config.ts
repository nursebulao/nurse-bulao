const required=['DATABASE_URL','SESSION_SECRET','APP_URL'];
for(const key of required) if(!process.env[key]) throw new Error(`Missing required environment variable: ${key}`);
if(process.env.NODE_ENV==='production' && process.env.SESSION_SECRET!.length<32) throw new Error('SESSION_SECRET must be at least 32 characters in production');
export const config={sessionSecret:process.env.SESSION_SECRET!,appUrl:process.env.APP_URL!,isProd:process.env.NODE_ENV==='production',cookieSecure:process.env.NODE_ENV==='production'};
