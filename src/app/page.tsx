// src/app/page.tsx
"use client"
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const Home: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [purchaseValue, setPurchaseValue] = useState<string>('');
  const router = useRouter();

  // Definir a data atual como padrão
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setSelectedDate(today);
  }, []);

  const handleStart = async () => {
    if (selectedDate && purchaseValue) {
      try {
        router.push(`/calculator?date=${encodeURIComponent(selectedDate)}&value=${encodeURIComponent(purchaseValue)}`);
      } catch (error) {
        console.error('Erro ao navegar para a página de cálculo:', error);
      }
    } else {
      alert('Por favor, selecione uma data e informe o valor da compra.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 shadow-lg rounded-lg max-w-sm w-full">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-700">Começar as Compras</h1>
        
        <div className="mb-6">
          <label htmlFor="date" className="block text-lg font-semibold text-gray-600 mb-2">Escolha uma data:</label>
          <input
            type="date"
            id="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full text-black p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mb-6">
          <label htmlFor="value" className="block text-lg font-semibold text-gray-600 mb-2">Informe o valor da compra:</label>
          <input
            type="number"
            id="value"
            value={purchaseValue}
            onChange={(e) => setPurchaseValue(e.target.value)}
            className="w-full text-black p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            min="0"
            step="0.01"
          />
        </div>

        <button
          onClick={handleStart}
          className="bg-green-500 text-white rounded-lg p-3 text-base font-semibold w-full hover:bg-blue-600 transition duration-300"
        >
          Iniciar
        </button>
      </div>
    </div>
  );
};

export default Home;
