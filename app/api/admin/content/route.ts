import { apiAdmin,sameOrigin } from '../../../../lib/admin-auth';
import { database,readContent } from '../../../../lib/content-store';
import { contentSchema } from '../../../../lib/content';
export const dynamic='force-dynamic';
const response=(body:unknown,status=200)=>Response.json(body,{status,headers:{'Cache-Control':'no-store'}});
export async function GET(request:Request){if(!apiAdmin(request))return response({error:'Only an authorized administrator can edit this website.'},403);let draft=await readContent('draft');const published=await readContent();if(!draft.revision)draft={...draft,content:published.content};return response({...draft,publishedAt:published.updatedAt,publishedRevision:published.revision});}
export async function PUT(request:Request){
 if(!apiAdmin(request))return response({error:'Only an authorized administrator can edit this website.'},403);
 if(!sameOrigin(request))return response({error:'Request origin is not allowed.'},403);
 const raw=await request.text();if(raw.length>500000)return response({error:'Content is too large.'},413);
 let body;try{body=JSON.parse(raw)}catch{return response({error:'Invalid content.'},400)}
 const parsed=contentSchema.safeParse(body.content);if(!parsed.success)return response({error:parsed.error.issues[0].message},400);
 if(!Number.isSafeInteger(body.revision)||body.revision<0)return response({error:'Invalid draft revision.'},400);
 const date=new Date().toISOString(),db=database();
 const result=body.revision===0?await db.prepare('INSERT INTO content_documents (id, body, revision, updated_at) VALUES (?, ?, 1, ?) ON CONFLICT(id) DO NOTHING').bind('draft',JSON.stringify(parsed.data),date).run():await db.prepare('UPDATE content_documents SET body = ?, revision = revision + 1, updated_at = ? WHERE id = ? AND revision = ?').bind(JSON.stringify(parsed.data),date,'draft',body.revision).run();
 if(!result.meta.changes)return response({error:'The draft changed in another session. Reload the editor before saving again.'},409);
 return response({revision:body.revision+1,updatedAt:date});
}
