import { BookingStatus } from '@prisma/client';
const allowed:Record<BookingStatus,BookingStatus[]>={
 REQUESTED:['VERIFIED','CANCELLED'], VERIFIED:['MATCHING','CANCELLED'], MATCHING:['NURSE_OFFERED','CANCELLED'], NURSE_OFFERED:['NURSE_ASSIGNED','MATCHING','CANCELLED'], NURSE_ASSIGNED:['IN_PROGRESS','CANCELLED'], IN_PROGRESS:['COMPLETED'], COMPLETED:[], CANCELLED:[]
};
export function assertTransition(from:BookingStatus,to:BookingStatus){if(!allowed[from].includes(to)) throw new Error(`Invalid booking transition ${from} -> ${to}`)}
