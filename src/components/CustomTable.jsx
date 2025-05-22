import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';

const CustomTable = ({ data }) => {
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: 'asc'
  });

  const sortedData = React.useMemo(() => {
    if (!sortConfig.key) return data;

    return [...data].sort((a, b) => {
      let aValue = a[sortConfig.key];
      let bValue = b[sortConfig.key];

      // Handle special cases for calculated fields
      if (sortConfig.key === 'totalSales') {
        aValue = a.ventes_mensuelles.reduce((sum, sales) => sum + sales, 0);
        bValue = b.ventes_mensuelles.reduce((sum, sales) => sum + sales, 0);
      } else if (sortConfig.key === 'totalRevenue') {
        aValue = a.ventes_mensuelles.reduce((sum, sales) => sum + sales, 0) * a.prix;
        bValue = b.ventes_mensuelles.reduce((sum, sales) => sum + sales, 0) * b.prix;
      }

      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [data, sortConfig]);

  const requestSort = (key) => {
    setSortConfig(prevConfig => ({
      key,
      direction: 
        prevConfig.key === key && prevConfig.direction === 'asc'
          ? 'desc'
          : 'asc',
    }));
  };

  const getSortIcon = (columnKey) => {
    if (sortConfig.key !== columnKey) {
      return <ArrowUpDown className="w-4 h-4 ml-1" />;
    }
    return sortConfig.direction === 'asc' 
      ? <ArrowUp className="w-4 h-4 ml-1" />
      : <ArrowDown className="w-4 h-4 ml-1" />;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-MA', {
      style: 'currency',
      currency: 'MAD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  const formatNumber = (number) => {
    return new Intl.NumberFormat('fr-MA').format(number);
  };

  const columns = [
    { key: 'image', label: 'Image' },
    { key: 'reference', label: 'Référence' },
    { key: 'nom', label: 'Nom' },
    { key: 'categorie', label: 'Catégorie' },
    { key: 'prix', label: 'Prix' },
    { key: 'totalSales', label: 'Ventes Totales' },
    { key: 'totalRevenue', label: 'Chiffre d\'Affaires' }
  ];

  return (
    <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-200">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr className="bg-gray-50">
              {columns.map(column => (
                <th
                  key={column.key}
                  className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer group"
                  onClick={() => requestSort(column.key)}
                >
                  <div className="flex items-center">
                    <span>{column.label}</span>
                    <span className="text-gray-400 group-hover:text-gray-600 transition-colors">
                      {getSortIcon(column.key)}
                    </span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedData.map((product) => {
              const totalSales = product.ventes_mensuelles.reduce((sum, sales) => sum + sales, 0);
              const totalRevenue = totalSales * product.prix;

              return (
                <tr 
                  key={product.reference} 
                  className="hover:bg-gray-50 transition-colors duration-200"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <img src={product.image} alt={product.nom} className="w-16 h-16 object-cover rounded-lg" />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-gray-900">{product.reference}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-800">{product.nom}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {product.categorie}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-800">{formatCurrency(product.prix)}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-800">{formatNumber(totalSales)}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-gray-900">{formatCurrency(totalRevenue)}</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

CustomTable.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      reference: PropTypes.string.isRequired,
      nom: PropTypes.string.isRequired,
      prix: PropTypes.number.isRequired,
      categorie: PropTypes.string.isRequired,
      ventes_mensuelles: PropTypes.arrayOf(PropTypes.number).isRequired,
      image: PropTypes.string.isRequired, // Add image to prop types
    })
  ).isRequired,
};

export default CustomTable;