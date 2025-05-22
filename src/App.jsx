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

const App = () => {
  const activeTab = useSelector(state => state.sales.activeTab);
  const dispatch = useDispatch();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Set initial active tab
  useEffect(() => {
    if (!activeTab) {
      dispatch(setActiveTab('dashboard'));
    }
  }, [dispatch, activeTab]);

  const handleTabChange = (tab) => {
    dispatch(setActiveTab(tab));
  };

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
            {activeTab === 'customers' && <div className="p-6">Section Clients - À implémenter</div>}
            {activeTab === 'settings' && <SettingsPanel />}
          </main>
        </div>
      </div>
    </Provider>
  );
};

export default App;