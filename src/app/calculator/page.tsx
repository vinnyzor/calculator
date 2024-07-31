// src/app/calculator/page.tsx
"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AiOutlineMinus, AiOutlinePlus } from 'react-icons/ai';
import Footer from '@/app/components/Footer'; // Ajuste o caminho conforme a estrutura do seu projeto

type ButtonValue = 'C' | '±' | '%' | '÷' | '×' | '−' | '+' | '=' | '.' | string;

const Calculator: React.FC = () => {
  const [displayValue, setDisplayValue] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [purchaseValue, setPurchaseValue] = useState<number | null>(null);
  const [items, setItems] = useState<{ id: number; value: number }[]>([]);
  const [totalItemsValue, setTotalItemsValue] = useState<number>(0);
  const [nextId, setNextId] = useState<number>(1);
  const router = useRouter();

  useEffect(() => {
    const url = new URL(window.location.href);
    const dateParam = url.searchParams.get('date');
    const valueParam = url.searchParams.get('value');

    if (dateParam) {
      setSelectedDate(dateParam);
      fetchItems(dateParam);
    }

    if (valueParam) {
      setPurchaseValue(parseFloat(valueParam));
    }

    const fetchNextId = async () => {
      try {
        const response = await fetch('/api/get-next-id');
        const data = await response.json();
        setNextId(data.nextId || 1);
      } catch (error) {
        console.error('Error fetching next ID:', error);
      }
    };

    fetchNextId();
  }, []);

  const fetchItems = async (date: string) => {
    try {
      const response = await fetch(`/api/get-items?date=${encodeURIComponent(date)}`);
      const data = await response.json();
      const items = data.items || [];
      const totalValue = items.reduce((sum: number, item: { value: number }) => sum + item.value, 0);

      setItems(items);
      setTotalItemsValue(totalValue);
    } catch (error) {
      console.error('Error fetching items:', error);
    }
  };

  const formatCurrency = (value: number) => {
    const reais = (value / 100).toFixed(2);
    return `R$ ${reais.replace('.', ',')}`;
  };

  const handleButtonClick = async (value: ButtonValue) => {
    if (value === 'C') {
      setDisplayValue('');
      return;
    }

    if (value === '±') {
      setDisplayValue(prev => (prev.startsWith('-') ? prev.substring(1) : '-' + prev));
      return;
    }

    if (value === '.') {
      if (!displayValue.includes(',')) {
        setDisplayValue(prev => prev + value);
      }
      return;
    }

    setDisplayValue(prev => prev === '' && value === '0' ? prev : prev + value);

    const parts = displayValue.split(',');
    if (parts.length > 1 && parts[1].length > 2) {
      setDisplayValue(prev => {
        const [integerPart, decimalPart] = prev.split(',');
        return `${integerPart},${decimalPart.substring(0, 2)}`;
      });
    }
  };

  const handleIncrement = () => setQuantity(quantity + 1);
  const handleDecrement = () => setQuantity(Math.max(1, quantity - 1));

  const numericDisplayValue = parseFloat(displayValue.replace(',', '.')) || 0;
  const displayValueInCents = Math.round(numericDisplayValue * 100);
  const totalPriceInCents = displayValueInCents * quantity;

  const handleInsertItem = async () => {
    if (selectedDate && purchaseValue !== null) {
      try {
        await fetch('/api/save-item', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: nextId,
            date: selectedDate,
            value: totalPriceInCents,
            purchaseValue: purchaseValue
          }),
        });
        alert('Item salvo com sucesso!');
        setDisplayValue(''); // Clear the display after successful save
        setQuantity(1); // Reset quantity to 1
        setNextId(nextId + 1); // Increment the next ID
        fetchItems(selectedDate); // Refresh the item list
      } catch (error) {
        console.error('Erro ao salvar o item:', error);
        alert('Erro ao salvar o item.');
      }
    } else {
      alert('Data ou valor da compra não selecionado.');
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="max-w-sm bg-black mx-auto p-4 shadow-lg rounded-lg flex-1">
      <button 
  onClick={() => {
    if (selectedDate) {
      router.push(`/items?date=${encodeURIComponent(selectedDate)}&value=${encodeURIComponent(purchaseValue || '')}`);
    } else {
      alert('Data não selecionada.');
    }
  }}
  className="bg-blue-300 text-black rounded-lg mb-2 w-full p-1 text-base font-semibold"
>
  Ver Lista de Compra
</button>



        <div className="mb-4">
        <div className="p-2 bg-gray-100 rounded-lg text-right text-black text-2xl font-semibold">
          {formatCurrency(totalPriceInCents)}
        </div>
      </div>


        <div className="mb-4 flex items-center justify-between">
        <div className="text-lg mx-2 font-semibold">
          Qnt: {quantity}
        </div>
        <div className="flex space-x-2">
          <button onClick={handleDecrement} className="bg-[#333333] p-2 rounded-full">
            <AiOutlineMinus className="text-xl text-white" />
          </button>
          <button onClick={handleIncrement} className="bg-[#333333] p-2 rounded-full">
            <AiOutlinePlus className="text-xl text-white" />
          </button>
        </div>
        
        <button onClick={() => handleButtonClick('C')} className="bg-gray-200 px-4 ml-4  text-black rounded-full p-1 text-xl font-semibold">Apagar</button>
      </div>

        <div className="grid grid-cols-3 gap-2">
          

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
          <button onClick={() => handleButtonClick('.')} className="bg-[#333333] rounded-full p-6 text-xl font-semibold">,</button>
          
          <button onClick={handleInsertItem} className="bg-green-400 col-span-3 text-black rounded-full p-3 text-base font-semibold">Inserir Item</button>
        </div>
      </div>
      <Footer purchaseValue={purchaseValue || 0} totalItemsValue={totalItemsValue} />
    </div>
  );
};

export default Calculator;
