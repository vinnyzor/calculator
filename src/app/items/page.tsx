// src/app/items/page.tsx
"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FaEdit, FaTrash } from 'react-icons/fa'; // Importando ícones

const ItemsPage: React.FC = () => {
  const [items, setItems] = useState<{ id: number; value: number }[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [purchaseValue, setPurchaseValue] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const url = new URL(window.location.href);
    const dateParam = url.searchParams.get('date');
    const valueParam = url.searchParams.get('value');

    console.log('Date Param:', dateParam);
    console.log('Value Param:', valueParam);

    if (dateParam) {
      setSelectedDate(dateParam);
      fetchItems(dateParam);
    }

    if (valueParam) {
      setPurchaseValue(valueParam);
    }
  }, []);

  const fetchItems = async (date: string) => {
    try {
      const response = await fetch(`/api/get-items?date=${encodeURIComponent(date)}`);
      const data = await response.json();
      setItems(data.items || []);
    } catch (error) {
      console.error('Error fetching items:', error);
    }
  };

  const formatCurrency = (value: number) => {
    const reais = (value / 100).toFixed(2);
    return `R$ ${reais.replace('.', ',')}`;
  };

  const handleBackClick = () => {
    if (selectedDate) {
      router.push(`/calculator?date=${encodeURIComponent(selectedDate)}${purchaseValue !== null ? `&value=${encodeURIComponent(purchaseValue)}` : ''}`);
    } else {
      router.push('/calculator');
    }
  };

  const handleEditClick = (id: number) => {
    if (selectedDate) {
      router.push(`/edit-item?id=${id}&date=${encodeURIComponent(selectedDate)}&value=${encodeURIComponent(purchaseValue || '')}`);
   
    } else {
      console.error('Data não encontrada. Não é possível redirecionar para a página de edição.');
      alert('Data não encontrada. Não é possível redirecionar para a página de edição.');
    }
  };
  

  const handleDeleteClick = async (id: number) => {
    try {
      const response = await fetch(`/api/delete-item?id=${id}&date=${encodeURIComponent(selectedDate)}`, {
        method: 'DELETE',
      });
  
      if (response.ok) {
        setItems(items.filter(item => item.id !== id));
      } else {
        console.error('Failed to delete item:', await response.json());
      }
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };
  

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <div className="max-w-4xl mx-auto p-8 bg-white shadow-lg rounded-lg flex-1">
        <button
          onClick={handleBackClick}
          className="bg-yellow-400 text-black rounded-lg mb-4 p-2 text-base font-semibold"
        >
          Voltar
        </button>

        <h1 className="text-2xl font-bold mb-4 text-center text-gray-700">Lista de Compras - {selectedDate}</h1>

        {items.length === 0 ? (
          <p className="text-center text-gray-600">Nenhum item encontrado para a data selecionada.</p>
        ) : (
          <ul className="space-y-2">
            {items.map(item => (
              <li key={item.id} className="flex justify-between p-4 bg-gray-200 font-medium text-black rounded-lg">
                <span>Item {item.id}</span>
                <span>{formatCurrency(item.value)}</span>
                <div className="flex space-x-2">
                  <button onClick={() => handleEditClick(item.id)} className="text-blue-500 hover:text-blue-700">
                    <FaEdit />
                  </button>
                  <button onClick={() => handleDeleteClick(item.id)} className="text-red-500 hover:text-red-700">
                    <FaTrash />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ItemsPage;
