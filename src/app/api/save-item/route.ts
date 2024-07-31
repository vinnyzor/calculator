import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

interface SaveItemRequest {
  id: number;
  date: string;
  value: number;
  purchaseValue?: number; // Tornar o purchaseValue opcional
}

export async function POST(request: Request) {
  try {
    const data: SaveItemRequest = await request.json();

    if (typeof data.id !== 'number' || !data.date || typeof data.value !== 'number') {
      console.error('Invalid request body:', data);
      return NextResponse.json({ message: 'Invalid request body. "id", "date", and "value" must be provided.' }, { status: 400 });
    }

    const { id, date, value, purchaseValue } = data;

    const filePath = path.resolve(process.cwd(), 'src', 'app', 'data', 'items.json');
    let allItems: Record<string, { items: { id: number; value: number }[]; purchaseValue?: number }> = {};

    if (fs.existsSync(filePath)) {
      const fileContent = fs.readFileSync(filePath, 'utf8');
      if (fileContent.trim()) {
        allItems = JSON.parse(fileContent);
      }
    }

    if (!allItems[date]) {
      allItems[date] = { items: [] };
    }

    const existingItemIndex = allItems[date].items.findIndex(item => item.id === id);
    if (existingItemIndex !== -1) {
      allItems[date].items[existingItemIndex].value = value;
    } else {
      allItems[date].items.push({ id, value });
    }

    if (purchaseValue !== undefined) {
      allItems[date].purchaseValue = purchaseValue;
    }

    fs.writeFileSync(filePath, JSON.stringify(allItems, null, 2), 'utf8');

    return NextResponse.json({ message: 'Item salvo com sucesso!' });
  } catch (error) {
    console.error('Erro ao salvar o item:', error instanceof Error ? error.message : error);
    return NextResponse.json({ message: 'Erro ao salvar o item.', error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
}
