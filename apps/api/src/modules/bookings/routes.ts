import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import crypto from 'node:crypto';
import { prisma } from '@nurse-bulao/database/client';
import { BookingStatus } from '@prisma/client';
import { assertTransition } from './state-machine.js';
import { requireRoles } from '../../middleware/auth.js';

const createSchema=z.object({fullName:z.string().trim().min(2).max(100),phone:z.string().regex(/^\+?[0-9]{10,15}$/),city:z.string().trim().min(2).max(80),address:z.string().trim().min(5).max(300),serviceType:z.string().trim().min(2).max(80),startAt:z.coerce.date(),endAt:z.coerce.date(),requirement:z.string().trim().min(5).max(2000)}).refine(x=>x.endAt>x.startAt,{message:'endAt must be after startAt'});
export async function bookingRoutes(app:FastifyInstance){
 app.post('/v1/bookings',{config:{rateLimit:{max:10,timeWindow:'1 day'}}},async(req,reply)=>{
  const x=createSchema.parse(req.body);
  const existing=await prisma.user.findUnique({where:{phone:x.phone}});
  if(existing && existing.role!=='PATIENT') return reply.code(409).send({error:'This phone is already registered for another account type'});
  const user=existing ?? await prisma.user.create({data:{phone:x.phone,role:'PATIENT'}});
  const patient=await prisma.patient.upsert({where:{userId:user.id},update:{fullName:x.fullName,city:x.city,address:x.address},create:{userId:user.id,fullName:x.fullName,city:x.city,address:x.address}});
  const publicId=`NB-${new Date().getUTCFullYear()}-${crypto.randomUUID().slice(0,8).toUpperCase()}`;
  const booking=await prisma.booking.create({data:{publicId,patientId:patient.id,city:x.city,address:x.address,serviceType:x.serviceType,startAt:x.startAt,endAt:x.endAt,requirement:x.requirement}});
  return reply.code(201).send({publicId:booking.publicId,status:booking.status});
 });
 app.patch('/v1/admin/bookings/:id/status',{preHandler:requireRoles('SUPER_ADMIN','OPERATIONS_MANAGER','BOOKING_COORDINATOR')},async(req,reply)=>{
  const body=z.object({status:z.nativeEnum(BookingStatus)}).parse(req.body); const id=z.string().uuid().parse((req.params as {id:string}).id);
  const b=await prisma.booking.findUnique({where:{id}}); if(!b) return reply.code(404).send({error:'Not found'});
  assertTransition(b.status,body.status);
  const updated=await prisma.$transaction(async tx=>{const u=await tx.booking.update({where:{id:b.id},data:{status:body.status,cancelledAt:body.status==='CANCELLED'?new Date():b.cancelledAt,completedAt:body.status==='COMPLETED'?new Date():b.completedAt}}); await tx.auditLog.create({data:{actorUserId:req.authUser!.id,action:'BOOKING_STATUS_CHANGED',entityType:'Booking',entityId:b.id,oldData:{status:b.status},newData:{status:body.status},ipAddress:req.ip}}); return u;});
  return updated;
 });
}
