// src/app/api/get-next-id/route.ts
import { NextResponse } from 'next/server';

let currentId = 1; // In a real application, manage this in a database

export async function GET() {
  return NextResponse.json({ nextId: currentId++ });
}
