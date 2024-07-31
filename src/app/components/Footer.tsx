// src/components/Footer.tsx
import React from 'react';

import { IoIosList } from "react-icons/io";
import { FaPhone } from 'react-icons/fa';
import { FiGrid, FiSearch, FiBookmark, FiUser } from 'react-icons/fi';

interface FooterProps {
  purchaseValue: number | null;  // Assumido como valor em centavos
  totalItemsValue: number;       // Assumido como valor em centavos
}

const Footer: React.FC<FooterProps> = ({ purchaseValue, totalItemsValue }) => {
  // Função para formatar valores em centavos para reais
  const formatCurrency = (value: number) => {
    const reais = (value / 100).toFixed(2);
    return `R$ ${reais.replace('.', ',')}`;
  };

  // Calcular a diferença entre purchaseValue e totalItemsValue
  const difference = purchaseValue !== null ? purchaseValue - totalItemsValue : null;

  // Formatando os valores
  const formattedPurchaseValue = purchaseValue !== null ? formatCurrency(purchaseValue) : 'Não disponível';
  const formattedTotalItemsValue = formatCurrency(totalItemsValue);
  const formattedDifference = difference !== null ? formatCurrency(difference) : 'N/A';

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-blue-500 text-white flex justify-around items-center h-16">
   
    <button className="flex flex-col items-center">
    {formattedPurchaseValue}
    </button>
    <button className="flex items-center font-extrabold justify-center w-28 h-28 bg-blue-400 p-1 rounded-full shadow-lg">
    {formattedTotalItemsValue}
</button>

    <button className="flex flex-col items-center">
    {formattedDifference}
    </button>
  
  </div>
  );
};

export default Footer;
