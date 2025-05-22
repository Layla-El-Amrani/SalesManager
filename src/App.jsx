// src/App.jsx
import React, { useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import { useSelector, useDispatch } from 'react-redux';
import { setActiveTab } from './redux/slices/salesSlice';
import Sidebar from './components/Sidebar';
import SalesDashboard from './components/SalesDashboard';
import SettingsPanel from './components/Settings';
import Products from './pages/Products';
import Clients from './pages/Clients';
import Reports from './pages/Reports';

const App = () => {
  const activeTab = useSelector(state => state.sales.activeTab);
  const dispatch = useDispatch();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Set initial active tab
  console.log('Valeur initiale de activeTab:', activeTab);
  
  useEffect(() => {
    console.log('useEffect - activeTab:', activeTab);
    if (!activeTab) {
      console.log('Définition de activeTab à dashboard');
      dispatch(setActiveTab('dashboard'));
    }
  }, [dispatch, activeTab]);
  
  console.log('Rendu - activeTab:', activeTab);

  const handleTabChange = (tab) => {
    dispatch(setActiveTab(tab));
  };

  console.log('activeTab:', activeTab);

  return (
    <Provider store={store}>
      <div className="flex h-screen bg-gray-50">
        {/* Sidebar */}
        <Sidebar 
          activeTab={activeTab} 
          setActiveTab={handleTabChange} 
          isCollapsed={isSidebarCollapsed}
          setIsCollapsed={setIsSidebarCollapsed}
        />
        
        {/* Main Content */}
        <div className={`flex-1 overflow-auto transition-all duration-300 ${
          isSidebarCollapsed ? 'ml-16' : 'ml-64'
        }`}>
          <main className="p-6">
            {activeTab === 'dashboard' && <SalesDashboard />}
            {activeTab === 'products' && <Products />}
            {activeTab === 'customers' && <Clients />}
            {activeTab === 'reports' && <Reports />}
            {activeTab === 'settings' && <SettingsPanel />}
          </main>
        </div>
      </div>
    </Provider>
  );
};

export default App;