import React, { useState } from 'react';
import { Download, FileText, FileSpreadsheet, FileType2 } from 'lucide-react';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

const Reports = () => {
  const [reportType, setReportType] = useState('ventes');
  const [dateRange, setDateRange] = useState({
    start: new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  });
  const [format, setFormat] = useState('pdf');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedReport, setGeneratedReport] = useState(null);

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setDateRange(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const generateReport = (e) => {
    e.preventDefault(); // Empêche le rechargement de la page
    
    if (!dateRange.start || !dateRange.end) {
      alert('Veuillez sélectionner une plage de dates valide');
      return;
    }

    setIsGenerating(true);
    
    // Simulation de génération de rapport
    setTimeout(() => {
      const report = {
        id: Date.now(),
        type: reportType,
        startDate: dateRange.start,
        endDate: dateRange.end,
        format,
        generatedAt: new Date().toISOString(),
        downloadUrl: '#'
      };
      
      setGeneratedReport(report);
      setIsGenerating(false);
      
      // Faire défiler jusqu'au rapport généré
      document.getElementById('generated-report')?.scrollIntoView({ behavior: 'smooth' });
    }, 1000);
  };

  const downloadReport = (report) => {
    if (report.format === 'pdf') {
      // Création d'un nouveau document PDF
      const doc = new jsPDF();
      const title = `Rapport ${report.type.charAt(0).toUpperCase() + report.type.slice(1)}`;
      const dateOptions = { year: 'numeric', month: 'long', day: 'numeric' };
      
      // En-tête du document
      doc.setFontSize(18);
      doc.text(title, 14, 22);
      doc.setFontSize(11);
      doc.setTextColor(100);
      
      // Sous-titre avec la période
      doc.text(
        `Période: du ${new Date(report.startDate).toLocaleDateString('fr-FR', dateOptions)} au ${new Date(report.endDate).toLocaleDateString('fr-FR', dateOptions)}`, 
        14, 
        30
      );
      
      // Informations de génération
      doc.text(
        `Généré le: ${new Date(report.generatedAt).toLocaleString('fr-FR', { ...dateOptions, hour: '2-digit', minute: '2-digit' })}`, 
        14, 
        38
      );
      
      // Ajout d'un tableau avec les données
      doc.autoTable({
        startY: 50,
        head: [['Type', 'Valeurs']],
        body: [
          ['Type de rapport', report.type],
          ['Période', `${report.startDate} au ${report.endDate}`],
          ['Date de génération', new Date(report.generatedAt).toLocaleString('fr-FR')],
        ],
        theme: 'grid',
        headStyles: { 
          fillColor: [41, 128, 185],
          textColor: 255,
          fontStyle: 'bold'
        },
        alternateRowStyles: { fillColor: [245, 245, 245] },
        margin: { top: 10 }
      });
      
      // Sauvegarde du PDF
      doc.save(`rapport-${report.type}-${report.startDate}-${report.endDate}.pdf`);
      
    } else if (report.format === 'excel' || report.format === 'csv') {
      // Pour Excel/CSV, on crée un fichier texte simple
      let content = `Rapport ${report.type}\n`;
      content += `Période: du ${report.startDate} au ${report.endDate}\n`;
      content += `Généré le: ${new Date(report.generatedAt).toLocaleString('fr-FR')}\n\n`;
      content += `Détails du rapport:\n`;
      content += `Type,${report.type}\n`;
      content += `Période,${report.startDate} au ${report.endDate}\n`;
      content += `Date de génération,${new Date(report.generatedAt).toLocaleString('fr-FR')}\n`;
      
      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `rapport-${report.type}-${report.startDate}-${report.endDate}.${report.format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Génération de rapports</h1>
        <p className="text-gray-600">Générez des rapports personnalisés selon vos besoins</p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">Paramètres du rapport</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Type de rapport */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Type de rapport</label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="ventes">Rapport des ventes</option>
              <option value="clients">Rapport clients</option>
              <option value="produits">Rapport des produits</option>
              <option value="stocks">Rapport des stocks</option>
              <option value="financier">Rapport financier</option>
            </select>
          </div>
          
          {/* Format du rapport */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Format</label>
            <div className="flex space-x-4">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  className="h-4 w-4 text-blue-600"
                  checked={format === 'pdf'}
                  onChange={() => setFormat('pdf')}
                />
                <span className="ml-2 text-gray-700">PDF</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  className="h-4 w-4 text-blue-600"
                  checked={format === 'excel'}
                  onChange={() => setFormat('excel')}
                />
                <span className="ml-2 text-gray-700">Excel</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  className="h-4 w-4 text-blue-600"
                  checked={format === 'csv'}
                  onChange={() => setFormat('csv')}
                />
                <span className="ml-2 text-gray-700">CSV</span>
              </label>
            </div>
          </div>
          
          {/* Période */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Période</label>
            <div className="flex space-x-2">
              <div className="flex-1">
                <input
                  type="date"
                  name="start"
                  value={dateRange.start}
                  onChange={handleDateChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="flex items-center text-gray-500">
                au
              </div>
              <div className="flex-1">
                <input
                  type="date"
                  name="end"
                  value={dateRange.end}
                  onChange={handleDateChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>
          
          {/* Filtres supplémentaires */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Filtres additionnels</label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              disabled
            >
              <option>Tous les produits</option>
              <option>Produits en stock</option>
              <option>Produits épuisés</option>
            </select>
          </div>
        </div>
        
        <div className="mt-6 flex justify-end">
          <button
            onClick={generateReport}
            disabled={isGenerating}
            className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${isGenerating ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {isGenerating ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Génération en cours...
              </>
            ) : (
              <>
                <FileText className="h-4 w-4 mr-2" />
                Générer le rapport
              </>
            )}
          </button>
        </div>
      </div>

      {generatedReport && (
        <div id="generated-report" className="bg-green-50 border-l-4 border-green-400 p-4 mb-8">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-green-700">
                Votre rapport a été généré avec succès !
              </p>
              <div className="mt-2">
                <button
                  onClick={() => downloadReport(generatedReport)}
                  className="inline-flex items-center text-sm font-medium text-green-700 hover:text-green-900 bg-green-100 hover:bg-green-200 px-3 py-1 rounded"
                >
                  <Download className="h-4 w-4 mr-1" aria-hidden="true" />
                  Télécharger le rapport
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">Rapports récents</h2>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Période
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Format
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date de génération
                </th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {generatedReport && (
                <tr key={generatedReport.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 capitalize">
                      {generatedReport.type.replace('-', ' ')}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {new Date(generatedReport.startDate).toLocaleDateString('fr-FR')} - {new Date(generatedReport.endDate).toLocaleDateString('fr-FR')}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                      {generatedReport.format.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(generatedReport.generatedAt).toLocaleString('fr-FR')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => downloadReport(generatedReport)}
                      className="text-blue-600 hover:text-blue-900 mr-4"
                    >
                      Télécharger
                    </button>
                    <button className="text-gray-500 hover:text-gray-700">
                      <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                      </svg>
                    </button>
                  </td>
                </tr>
              )}
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                  {!generatedReport ? 'Aucun rapport généré récemment' : 'Générez un nouveau rapport pour le voir apparaître ici'}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Reports;
