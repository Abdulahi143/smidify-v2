import { apiAdmin } from '../lib/admin-auth';
import { readContent } from '../lib/content-store';
import { renderSite } from '../lib/render-site';
export const dynamic='force-dynamic';
export async function GET(request:Request){const {content}=await readContent();return new Response(renderSite(content,false,apiAdmin(request)),{headers:{'Content-Type':'text/html; charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'}});}
