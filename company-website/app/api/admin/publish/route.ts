import { apiAdmin,sameOrigin } from '../../../../lib/admin-auth';
import { z } from 'zod';
import { database } from '../../../../lib/content-store';
export const dynamic='force-dynamic';
export async function POST(request:Request){
 if(!apiAdmin(request)||!sameOrigin(request))return Response.json({error:'You do not have permission to publish.'},{status:403});
 let raw;try{raw=await request.json()}catch{return Response.json({error:'Invalid request.'},{status:400})}
 const parsed=z.object({revision:z.number().int().min(1)}).safeParse(raw);if(!parsed.success)return Response.json({error:'Save your draft before publishing.'},{status:400});const body=parsed.data;
 if(!Number.isSafeInteger(body.revision)||body.revision<1)return Response.json({error:'Save your draft before publishing.'},{status:400});
 const date=new Date().toISOString();
 const result=await database().prepare("INSERT INTO content_documents (id, body, revision, updated_at) SELECT 'published', body, revision, ? FROM content_documents WHERE id = 'draft' AND revision = ? ON CONFLICT(id) DO UPDATE SET body = excluded.body, revision = excluded.revision, updated_at = excluded.updated_at").bind(date,body.revision).run();
 if(!result.meta.changes)return Response.json({error:'The draft has changed. Reload the editor and review it before publishing.'},{status:409});
 return Response.json({publishedAt:date,publishedRevision:body.revision},{headers:{'Cache-Control':'no-store'}});
}
