import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function PUT(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const value = searchParams.get('value');
    const date = searchParams.get('date') || '';

    if (!id || !value) {
      return NextResponse.json({ message: 'ID do item ou valor não fornecido.' }, { status: 400 });
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

    const items = allItems[date].items.map(item => 
      item.id === parseInt(id) ? { ...item, value: parseInt(value) } : item
    );

    allItems[date].items = items;

    fs.writeFileSync(filePath, JSON.stringify(allItems, null, 2));

    return NextResponse.json({ message: 'Item atualizado com sucesso.' });
  } catch (error) {
    console.error('Erro ao atualizar item:', error instanceof Error ? error.message : error);
    return NextResponse.json({ message: 'Erro ao atualizar item.', error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
}
