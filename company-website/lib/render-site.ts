import { template } from './site-template';
import type { SiteContent } from './content';
export function escapeHtml(value:string){return value.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]!));}
export function renderSite(content:SiteContent,preview=false,admin=false){
 const projects='<div class="project-grid">'+content.projects.map((p,i)=>`<article class="project">${p.image?`<div class="project-art"><img class="project-image" src="${escapeHtml(p.image)}" alt="${escapeHtml(p.title)}" loading="lazy" referrerpolicy="no-referrer"></div>`:`<div class="project-art ${['web','apps','systems'][i%3]}" aria-hidden="true"><div class="project-symbol"></div><span>${p.placeholder?'Project preview to come':escapeHtml(p.category)}</span></div>`}<div class="project-type">${escapeHtml(p.category)}${p.placeholder?' / Placeholder':''}</div><h3>${escapeHtml(p.title)}</h3><p>${escapeHtml(p.customer)}</p><dl>${[['The brief',p.brief],['Our solution',p.solution],['The outcome',p.outcome]].filter(([,v])=>v).map(([label,value])=>`<dt>${label}</dt><dd>${escapeHtml(value).replaceAll('\n','<br>')}</dd>`).join('')}</dl>${p.url?`<a class="project-link" href="${escapeHtml(p.url)}" target="_blank" rel="noopener noreferrer">Visit project ↗</a>`:''}</article>`).join('')+'</div>';
 const milestones='<div class="timeline">'+content.milestones.map(m=>`<article class="milestone"><time>${escapeHtml(m.date)}</time><div><h3>${escapeHtml(m.title)}</h3><p>${escapeHtml(m.description).replaceAll('\n','<br>')}</p></div></article>`).join('')+'</div>';
 let html=template.replace(/\{\{(\w+)\}\}/g,(_,key)=>{
 if(key==='projects')return projects;if(key==='milestones')return milestones;
 const text=content.copy[key]??'';
 if(key==='heroTitle'){const lines=text.split('\n');return lines.map((line,i)=>i===lines.length-1?`<span>${escapeHtml(line)}</span>`:escapeHtml(line)).join('<br>');}
 if(key.endsWith('Title') && key!=='metaTitle')return escapeHtml(text).replaceAll('\n','<br>');
 return escapeHtml(text);
 });
 if(preview)html=html.replace('<body>','<body><div class="draft-banner"><span>Draft preview — changes are not live yet.</span><a href="/admin">Back to editor</a></div>');
 if(admin)html=html.replace('</footer>','<a href="/admin">Manage website ↗</a></footer>');
 return html;
}
