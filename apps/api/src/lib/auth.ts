import crypto from 'node:crypto';
import { prisma } from '@nurse-bulao/database/client';
export async function createSession(userId:string){
 const token=crypto.randomBytes(32).toString('base64url');
 const secretHash=crypto.createHash('sha256').update(token).digest('hex');
 const expiresAt=new Date(Date.now()+1000*60*60*8);
 const s=await prisma.session.create({data:{userId,secretHash,expiresAt}});
 return {id:s.id,token,expiresAt};
}
export async function getSession(id:string|undefined,token:string|undefined){
 if(!id||!token) return null;
 const hash=crypto.createHash('sha256').update(token).digest('hex');
 const s=await prisma.session.findFirst({where:{id,secretHash:hash,expiresAt:{gt:new Date()}}});
 return s;
}
