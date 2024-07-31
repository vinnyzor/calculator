"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const EditItemPage: React.FC = () => {
  const [originalValue, setOriginalValue] = useState<number>(0); // Valor antigo do item em centavos
  const [itemValue, setItemValue] = useState<string>(''); // Valor a ser editado
  const [date, setDate] = useState<string>('');
  const [purchaseValue, setPurchaseValue] = useState<number | undefined>(undefined); // Valor da compra
  const [itemId, setItemId] = useState<number | null>(null);
  const router = useRouter();

  useEffect(() => {
    const url = new URL(window.location.href);
    const id = url.searchParams.get('id');
    const dateParam = url.searchParams.get('date');
    const valueParam = url.searchParams.get('value');

    if (id && dateParam) {
      setItemId(Number(id));
      setDate(dateParam);
      fetchItem(Number(id), dateParam);
    } else {
      console.error('Parâmetros da URL ausentes ou inválidos.');
      alert('Parâmetros da URL ausentes ou inválidos.');
    }
  }, []);

  const fetchItem = async (id: number, date: string) => {
    try {
      const response = await fetch(`/api/get-items?date=${date}`);
      const data = await response.json();
      const item = data.items.find((item: { id: number }) => item.id === id);
      if (item) {
        setOriginalValue(item.value); // Definir o valor original em centavos
        setItemValue(''); // Campo para novo valor deve começar vazio
        setPurchaseValue(data.purchaseValue); // Define o valor da compra correto
      } else {
        console.error('Item não encontrado.');
        alert('Item não encontrado.');
      }
    } catch (error) {
      console.error('Erro ao buscar o item:', error);
      alert('Erro ao buscar o item.');
    }
  };

  const handleSave = async () => {
    if (itemId !== null && itemValue !== '' && date) {
      // Converte o valor para centavos
      const value = Math.round(parseFloat(itemValue.replace(',', '.')) * 100);

      if (isNaN(value) || value < 0) {
        alert('Valor inválido.');
        return;
      }

      if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
        alert('Data inválida.');
        return;
      }

      try {
        const response = await fetch('/api/update-item', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id: itemId, value, date }),
        });

        if (response.ok) {
          alert('Item atualizado com sucesso!');
          router.push(`/items?date=${encodeURIComponent(date)}&value=${encodeURIComponent(purchaseValue?.toString() || '')}`); // Usa o valor da compra na URL
        } else {
          const error = await response.json();
          alert(`Erro ao atualizar o item: ${error.message}`);
        }
      } catch (error) {
        console.error('Erro ao atualizar o item:', error);
        alert('Erro ao atualizar o item.');
      }
    } else {
      alert('Por favor, preencha todos os campos.');
    }
  };

  const handleButtonClick = (value: string) => {
    if (value === 'C') {
      setItemValue('');
      return;
    }

    if (value === ',') {
      if (!itemValue.includes(',')) {
        setItemValue(prev => prev + value);
      }
      return;
    }

    if (value === '←') {
      setItemValue(prev => prev.slice(0, -1));
      return;
    }

    if (value === '±') {
      setItemValue(prev => (prev.startsWith('-') ? prev.slice(1) : '-' + prev));
      return;
    }

    // Impede a entrada de múltiplos zeros à esquerda
    if (value === '0' && (itemValue === '' || itemValue === '0')) {
      return;
    }

    setItemValue(prev => prev + value);
  };

  const handleBack = () => {
    router.push(`/items?date=${encodeURIComponent(date)}&value=${encodeURIComponent(purchaseValue?.toString() || '')}`);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="max-w-sm bg-black mx-auto p-4 shadow-lg rounded-lg flex-1">
        <h1 className="text-white text-2xl font-semibold mb-4">Editar Item</h1>

        <div className="mb-4">
          <div className="p-2 bg-gray-100 rounded-lg text-right text-black text-2xl font-semibold mb-2">
            Valor Antigo: R$ {(originalValue / 100).toFixed(2).replace('.', ',')}
          </div>
          <div className="p-2 bg-gray-200 rounded-lg text-right text-black text-2xl font-semibold">
            Valor Novo: {itemValue !== '' ? `R$ ${itemValue}` : 'R$ 0,00'}
          </div>
        </div>

        {/* Campo de entrada para o novo valor */}
        <input
          type="text"
          value={itemValue}
          onChange={(e) => setItemValue(e.target.value)}
          className="hidden" // Oculta o campo
        />


<div className="grid grid-cols-2 gap-2">
     {/* Botão para voltar */}
     <button
          onClick={handleBack}
          className="bg-gray-400 text-black rounded-full p-2 text-base font-semibold w-full mb-4"
        >
          Voltar
        </button>
        {/* Botão para salvar */}
        <button
          onClick={handleSave}
          className="bg-green-400 text-black rounded-full p-2 text-base font-semibold w-full mb-4"
        >
          Salvar
        </button>
        </div>

        {/* Teclado numérico */}
        <div className="grid grid-cols-3 gap-2">
          <button onClick={() => handleButtonClick('C')} className="bg-gray-200 col-span-3 text-black rounded-full p-3 text-xl font-semibold">Apagar</button>

          <button onClick={() => handleButtonClick('7')} className="bg-[#333333] rounded-full p-6 text-xl font-semibold">7</button>
          <button onClick={() => handleButtonClick('8')} className="bg-[#333333] rounded-full p-6 text-xl font-semibold">8</button>
          <button onClick={() => handleButtonClick('9')} className="bg-[#333333] rounded-full p-6 text-xl font-semibold">9</button>

          <button onClick={() => handleButtonClick('4')} className="bg-[#333333] rounded-full p-6 text-xl font-semibold">4</button>
          <button onClick={() => handleButtonClick('5')} className="bg-[#333333] rounded-full p-6 text-xl font-semibold">5</button>
          <button onClick={() => handleButtonClick('6')} className="bg-[#333333] rounded-full p-6 text-xl font-semibold">6</button>

          <button onClick={() => handleButtonClick('1')} className="bg-[#333333] rounded-full p-6 text-xl font-semibold">1</button>
          <button onClick={() => handleButtonClick('2')} className="bg-[#333333] rounded-full p-6 text-xl font-semibold">2</button>
          <button onClick={() => handleButtonClick('3')} className="bg-[#333333] rounded-full p-6 text-xl font-semibold">3</button>

          <button onClick={() => handleButtonClick('0')} className="bg-[#333333] col-span-2 rounded-full p-6 text-xl font-semibold">0</button>
          <button onClick={() => handleButtonClick(',')} className="bg-[#333333] rounded-full p-6 text-xl font-semibold">,</button>
        </div>
      </div>
    </div>
  );
};

export default EditItemPage;
