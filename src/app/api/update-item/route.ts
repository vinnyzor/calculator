// src/app/api/update-item/route.ts
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function PUT(request: Request) {
  try {
    const { id, value, date } = await request.json();

    if (typeof id !== 'number' || typeof value !== 'number' || typeof date !== 'string') {
      return NextResponse.json({ message: 'Dados inválidos.' }, { status: 400 });
    }

    const filePath = path.resolve(process.cwd(), 'src', 'app', 'data', 'items.json');
    let allItems: Record<string, { items: { id: number; value: number }[]; purchaseValue?: number }> = {};

    if (fs.existsSync(filePath)) {
      const fileContent = fs.readFileSync(filePath, 'utf8');
      if (fileContent.trim()) {
        allItems = JSON.parse(fileContent);
      }
    }

    if (!allItems[date]) {
      return NextResponse.json({ message: 'Data não encontrada.' }, { status: 404 });
    }

    const itemIndex = allItems[date].items.findIndex(item => item.id === id);
    if (itemIndex === -1) {
      return NextResponse.json({ message: 'Item não encontrado.' }, { status: 404 });
    }

    // Atualiza o valor do item
    allItems[date].items[itemIndex].value = value;

    // Salva as alterações de volta no arquivo JSON
    fs.writeFileSync(filePath, JSON.stringify(allItems, null, 2), 'utf8');

    return NextResponse.json({ message: 'Item atualizado com sucesso.' });
  } catch (error) {
    console.error('Erro ao atualizar o item:', error instanceof Error ? error.message : error);
    return NextResponse.json({ message: 'Erro ao atualizar o item.', error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
}
