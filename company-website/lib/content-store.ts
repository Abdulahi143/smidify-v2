import { env } from 'cloudflare:workers';
import { defaultContent, type SiteContent } from './content';
export type Document={body:string;revision:number;updated_at:string};
export function database(){if(!env.DB)throw new Error('Website database is not configured.');return env.DB;}
export async function readDocument(id:string){return database().prepare('SELECT body, revision, updated_at FROM content_documents WHERE id = ?').bind(id).first<Document>();}
export async function readContent(id='published'){const row=await readDocument(id);return {content:row?JSON.parse(row.body) as SiteContent:defaultContent,revision:row?.revision??0,updatedAt:row?.updated_at??null};}
