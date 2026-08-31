import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { prisma } from '@nurse-bulao/database/client';
import { requireRoles } from '../../middleware/auth.js';
const nurseSchema=z.object({phone:z.string().regex(/^\+?[0-9]{10,15}$/),fullName:z.string().trim().min(2).max(100),city:z.string().trim().min(2).max(80),qualification:z.string().trim().min(2).max(150),experienceYears:z.number().int().min(0).max(60),registrationNumber:z.string().trim().min(3).max(100),registrationCouncil:z.string().trim().min(2).max(150)});
export async function nurseRoutes(app:FastifyInstance){
 app.post('/v1/nurses/register',{config:{rateLimit:{max:5,timeWindow:'1 day'}}},async(req,reply)=>{
  const x=nurseSchema.parse(req.body); const existing=await prisma.user.findUnique({where:{phone:x.phone}});
  if(existing && existing.role!=='NURSE') return reply.code(409).send({error:'This phone is already registered for another account type'});
  const user=existing ?? await prisma.user.create({data:{phone:x.phone,role:'NURSE'}});
  const nurse=await prisma.nurse.upsert({where:{userId:user.id},update:{...x},create:{userId:user.id,...x,verificationStatus:'SUBMITTED'}});
  return reply.code(201).send({id:nurse.id,verificationStatus:nurse.verificationStatus});
 });
 app.post('/v1/admin/bookings/:bookingId/assign',{preHandler:requireRoles('SUPER_ADMIN','OPERATIONS_MANAGER','BOOKING_COORDINATOR')},async(req,reply)=>{
  const x=z.object({nurseId:z.string().uuid()}).parse(req.body); const bookingId=z.string().uuid().parse((req.params as {bookingId:string}).bookingId);
  const result=await prisma.$transaction(async tx=>{
   const b=await tx.booking.findUnique({where:{id:bookingId}}); if(!b) return {error:'Booking not found' as const};
   if(!['MATCHING','NURSE_OFFERED'].includes(b.status)) return {error:'Booking is not assignable' as const};
   const nurse=await tx.nurse.findUnique({where:{id:x.nurseId}}); if(!nurse||nurse.verificationStatus!=='VERIFIED'||nurse.profileStatus!=='ACTIVE') return {error:'Nurse is not verified and active' as const};
   const overlap=await tx.bookingAssignment.findFirst({where:{nurseId:x.nurseId,status:{in:['OFFERED','ACCEPTED']},booking:{startAt:{lt:b.endAt},endAt:{gt:b.startAt},status:{notIn:['CANCELLED','COMPLETED']}}}}); if(overlap) return {error:'Nurse has a conflicting assignment' as const};
   await tx.bookingAssignment.updateMany({where:{bookingId,status:'OFFERED'},data:{status:'CANCELLED'}});
   const assignment=await tx.bookingAssignment.create({data:{bookingId,nurseId:x.nurseId,status:'OFFERED',assignedById:req.authUser!.id}});
   await tx.booking.update({where:{id:bookingId},data:{status:'NURSE_OFFERED'}});
   await tx.auditLog.create({data:{actorUserId:req.authUser!.id,action:'NURSE_OFFERED',entityType:'Booking',entityId:bookingId,newData:{nurseId:x.nurseId,assignmentId:assignment.id},ipAddress:req.ip}});
   return {assignment};
  });
  if('error' in result) return reply.code(result.error==='Booking not found'?404:409).send(result); return reply.code(201).send(result.assignment);
 });
}
