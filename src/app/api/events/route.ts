import { NextResponse } from 'next/server';
import { seedEvents } from '@/data/seed-events';


export async function GET(){
return NextResponse.json(seedEvents);
}

