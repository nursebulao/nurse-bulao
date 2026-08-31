import type { FastifyReply, FastifyRequest } from 'fastify';
import { prisma } from '@nurse-bulao/database/client';
import crypto from 'node:crypto';
import { UserRole } from '@prisma/client';

declare module 'fastify' { interface FastifyRequest { authUser?: { id:string; role:UserRole } } }

export async function requireAuth(req:FastifyRequest, reply:FastifyReply){
 const id=req.cookies.nb_sid; const token=req.cookies.nb_st;
 if(!id||!token) return reply.code(401).send({error:'Authentication required'});
 const secretHash=crypto.createHash('sha256').update(token).digest('hex');
 const s=await prisma.session.findFirst({where:{id,secretHash,expiresAt:{gt:new Date()}},include:{user:true}});
 if(!s || s.user.status!=='ACTIVE') return reply.code(401).send({error:'Session invalid or expired'});
 req.authUser={id:s.user.id,role:s.user.role};
}
export function requireRoles(...roles:UserRole[]){ return async (req:FastifyRequest,reply:FastifyReply)=>{ await requireAuth(req,reply); if(reply.sent) return; if(!req.authUser || !roles.includes(req.authUser.role)) return reply.code(403).send({error:'Forbidden'}); }; }
