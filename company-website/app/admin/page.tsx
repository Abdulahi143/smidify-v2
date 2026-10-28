import { requireChatGPTUser } from '../chatgpt-auth';
import { isAdmin } from '../../lib/admin-auth';
import Editor from './editor';
export const dynamic='force-dynamic';
export default async function Admin(){const user=await requireChatGPTUser('/admin');if(!isAdmin(user))return <main style={{fontFamily:'Arial',padding:50}}><h1>Admin access required</h1><p>Your account does not have permission to edit this website.</p><a href="/">Return to website</a></main>;return <Editor name={user.displayName}/>;}
