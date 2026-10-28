import { env } from 'cloudflare:workers';
export function isAdmin(user:{email:string}|null){const emails=((env as unknown as {ADMIN_EMAILS?:string}).ADMIN_EMAILS??'').split(',').map(s=>s.trim().toLowerCase()).filter(Boolean);return !!user && emails.includes(user.email.toLowerCase());}
export function apiAdmin(request:Request){const id=request.headers.get('oai-authenticated-user-id'),email=request.headers.get('oai-authenticated-user-email');return !!id && !!email && isAdmin({email});}
export function sameOrigin(request:Request){const origin=request.headers.get('Origin');return origin===new URL(request.url).origin;}
