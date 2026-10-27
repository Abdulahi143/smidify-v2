import { apiAdmin } from '../../lib/admin-auth';
import { readContent } from '../../lib/content-store';
import { renderSite } from '../../lib/render-site';
export const dynamic='force-dynamic';
export async function GET(request:Request){if(!apiAdmin(request))return new Response('You do not have permission to preview drafts.',{status:403});let {content,revision}=await readContent('draft');if(!revision)({content}=await readContent());return new Response(renderSite(content,true),{headers:{'Content-Type':'text/html; charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'}});}
