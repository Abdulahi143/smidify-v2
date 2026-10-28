import { z } from 'zod';
import defaults from './default-content.json';
export const textKeys = Object.keys(defaults.copy);
const text = z.string().max(5000);
const link = z.string().max(2048).refine(v => !v || /^https:\/\//i.test(v) && (()=>{try{return !!new URL(v).hostname}catch{return false}})(), 'Use a full https:// URL.');
export const projectSchema = z.object({id:z.string().min(1).max(80),category:text,title:z.string().min(1).max(160),customer:text,brief:text,solution:text,outcome:text,image:link,url:link,placeholder:z.boolean()}).strict();
export const milestoneSchema = z.object({id:z.string().min(1).max(80),date:text,title:z.string().min(1).max(160),description:text}).strict();
export const contentSchema = z.object({copy:z.record(text).superRefine((copy,ctx)=>{
 if(Object.keys(copy).length!==textKeys.length || textKeys.some(k=>!(k in copy)))ctx.addIssue({code:z.ZodIssueCode.custom,message:'Website text fields do not match.'});
 if(!z.string().email().safeParse(copy.contactEmail).success)ctx.addIssue({code:z.ZodIssueCode.custom,message:'Enter a valid contact email address.'});
 if(!copy.heroTitle?.trim() || !copy.metaTitle?.trim())ctx.addIssue({code:z.ZodIssueCode.custom,message:'Page title and headline are required.'});
}),projects:z.array(projectSchema).max(40),milestones:z.array(milestoneSchema).max(60)}).strict().superRefine((v,ctx)=>{
 for(const list of [v.projects,v.milestones])if(new Set(list.map(i=>i.id)).size!==list.length)ctx.addIssue({code:z.ZodIssueCode.custom,message:'Each entry needs a unique ID.'});
});
export type SiteContent=z.infer<typeof contentSchema>;
export const defaultContent=defaults as SiteContent;
