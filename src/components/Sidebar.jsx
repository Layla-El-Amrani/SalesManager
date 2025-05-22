import { useState } from 'react';
import { 
  Home, 
  Package2, 
  User, 
  Settings,
  LogOut,
  BarChart3,
  FileText
} from 'lucide-react';

const Sidebar = ({ activeTab, setActiveTab, isCollapsed, setIsCollapsed }) => {

  const menuItems = [
    { icon: Home, label: 'Tableau de bord', path: 'dashboard' },
    { icon: Package2, label: 'Produits', path: 'products' },
    { icon: User, label: 'Clients', path: 'customers' },
    { icon: BarChart3, label: 'Rapports', path: 'reports' },
    { icon: Settings, label: 'Paramètres', path: 'settings' }
  ];

  const handleNavigation = (path) => {
    console.log('Navigation vers:', path);
    setActiveTab(path);
  };

  return (
    <div className={`fixed left-0 top-0 h-full bg-white shadow-lg z-10 ${isCollapsed ? 'w-16' : 'w-64'} transition-all duration-300`}>
      <div className="p-4 flex items-center gap-2 border-b border-gray-100">
        <div className="text-2xl font-bold">Vente</div>
        <div className="text-2xl font-bold text-blue-600">Pro</div>
      </div>

      <div className="mt-4 overflow-y-auto h-[calc(100vh-120px)]">
        {menuItems.map((item) => (
          <button
            key={item.path}
            onClick={() => handleNavigation(item.path)}
            className={`flex items-center gap-3 p-3 text-gray-700 hover:bg-gray-100 ${
              activeTab === item.path ? 'bg-blue-50 text-blue-600' : ''
            } w-full transition-colors duration-200`}
          >
            <item.icon className="w-5 h-5 flex-shrink-0" />
            {!isCollapsed && <span className="truncate">{item.label}</span>}
          </button>
        ))}
      </div>

      <div className="absolute bottom-0 w-full p-4 border-t border-gray-100">
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="flex items-center gap-3 p-3 text-gray-700 hover:bg-gray-100 w-full rounded-md transition-colors duration-200"
        >
          <LogOut className={`w-5 h-5 flex-shrink-0 ${isCollapsed ? 'mx-auto' : ''}`} />
          {!isCollapsed && <span>Déconnexion</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
