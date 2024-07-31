import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const date = searchParams.get('date') || '';

    if (!id) {
      return NextResponse.json({ message: 'ID do item não fornecido.' }, { status: 400 });
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

    // Filtra os itens para remover o item com o ID fornecido
    allItems[date].items = allItems[date].items.filter(item => item.id !== parseInt(id));

    // Salva as alterações no arquivo JSON
    fs.writeFileSync(filePath, JSON.stringify(allItems, null, 2), 'utf8');

    return NextResponse.json({ message: 'Item excluído com sucesso.' });
  } catch (error) {
    console.error('Erro ao excluir item:', error instanceof Error ? error.message : error);
    return NextResponse.json({ message: 'Erro ao excluir item.', error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
}
