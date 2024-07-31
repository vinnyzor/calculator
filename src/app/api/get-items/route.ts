// src/app/api/get-items/route.ts
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date') || '';

    const filePath = path.resolve(process.cwd(), 'src', 'app', 'data', 'items.json');
    let allItems: Record<string, { items: { id: number; value: number }[]; purchaseValue?: number }> = {};

    if (fs.existsSync(filePath)) {
      const fileContent = fs.readFileSync(filePath, 'utf8');
      if (fileContent.trim()) {
        allItems = JSON.parse(fileContent);
      }
    }

    const data = allItems[date] || { items: [], purchaseValue: 0 };
    return NextResponse.json(data);
  } catch (error) {
    console.error('Erro ao buscar itens:', error instanceof Error ? error.message : error);
    return NextResponse.json({ message: 'Erro ao buscar itens.', error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
}
