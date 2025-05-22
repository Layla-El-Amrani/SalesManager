import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { BarChart3, ShoppingCart, Package2, Filter, ChevronDown } from 'lucide-react';
import CustomTable from './CustomTable';

// Define constants for months and colors
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

const SubscriptionDashboard = () => {
  const dispatch = useDispatch();
  const { data, selectedCategory, activeTab } = useSelector(state => state.sales);

  useEffect(() => {
    dispatch(setActiveTab('subscription'));
  }, [dispatch]);

  // Prepare subscription data
  const subscriptionData = [
    {
      "reference": "SUB001",
      "nom": "Abonnement Basic",
      "prix": 199,
      "duree": "Mensuel",
      "ventes_mensuelles": [15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70]
    },
    {
      "reference": "SUB002",
      "nom": "Abonnement Premium",
      "prix": 499,
      "duree": "Mensuel",
      "ventes_mensuelles": [8, 12, 15, 20, 22, 25, 28, 30, 35, 40, 45, 50]
    },
    {
      "reference": "SUB003",
      "nom": "Abonnement Pro",
      "prix": 999,
      "duree": "Annuel",
      "ventes_mensuelles": [3, 5, 6, 8, 10, 12, 15, 18, 20, 22, 25, 28]
    }
  ];

  // Prepare data for charts
  const lineData = MONTHS.map((month, idx) => ({
    month,
    ...subscriptionData.reduce((acc, product) => ({
      ...acc,
      [product.nom]: product.ventes_mensuelles[idx] * product.prix
    }), {})
  }));

  const pieData = subscriptionData.map(product => ({
    name: product.nom,
    value: product.ventes_mensuelles.reduce((sum, sales) => sum + (sales * product.prix), 0)
  }));

  // Calculate statistics
  const totalRevenue = subscriptionData.reduce((sum, product) => 
    sum + product.ventes_mensuelles.reduce((s, sales) => s + (sales * product.prix), 0), 0
  );

  const totalSubscriptions = subscriptionData.reduce((sum, product) => 
    sum + product.ventes_mensuelles.reduce((s, sales) => s + sales, 0), 0
  );

  return (
    <div className="flex-1 p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Tableau de Bord des Abonnements</h1>
        <div className="relative">
          <select 
            value={selectedCategory} 
            onChange={(e) => dispatch(setSelectedCategory(e.target.value))}
            className="appearance-none pl-10 pr-10 py-2.5 bg-white border border-gray-300 rounded-lg shadow-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-medium"
          >
            <option value="all">Tous les types</option>
            <option value="mensuel">Mensuel</option>
            <option value="annuel">Annuel</option>
          </select>
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
          <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Chiffre d&apos;Affaires Total</h3>
              <p className="text-2xl font-bold text-gray-900 mt-2">{totalRevenue.toLocaleString()} MAD</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <BarChart3 className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Abonnements Totaux</h3>
              <p className="text-2xl font-bold text-gray-900 mt-2">{totalSubscriptions.toLocaleString()} abonnements</p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <ShoppingCart className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Taux de Conversion</h3>
              <p className="text-2xl font-bold text-gray-900 mt-2">{((totalSubscriptions / 1000) * 100).toFixed(1)}%</p>
            </div>
            <div className="p-3 bg-yellow-50 rounded-lg">
              <Package2 className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {/* Line Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Évolution des Abonnements</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={lineData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              {subscriptionData.map((product, index) => (
                <Line 
                  key={product.nom}
                  type="monotone"
                  dataKey={product.nom}
                  stroke={COLORS[index % COLORS.length]}
                  name={product.nom}
                  dot={{ r: 4 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Distribution des Revenus</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie 
                data={pieData}
                cx="50%"
                cy="50%"
                outerRadius={140}
                fill="#8884d8"
                dataKey="value"
                nameKey="name"
                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                labelLine={{ stroke: '#6B7280', strokeWidth: 1 }}
              >
                {pieData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white',
                  border: '1px solid #E5E7EB',
                  borderRadius: '0.5rem',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
                formatter={(value) => `${value.toLocaleString()} MAD`}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Subscription Table */}
      <div className="bg-white rounded-xl shadow-sm">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Détails des Abonnements</h2>
        <CustomTable 
          data={subscriptionData}
          columns={[
            { key: 'nom', label: 'Nom de l&apos;Abonnement' },
            { key: 'prix', label: 'Prix', formatter: (value) => `${value} MAD` },
            { key: 'duree', label: 'Durée' },
            { 
              key: 'revenue', 
              label: 'Revenu Total',
              formatter: (row) => {
                const total = row.ventes_mensuelles.reduce((sum, sales) => sum + (sales * row.prix), 0);
                return `${total.toLocaleString()} MAD`;
              }
            },
            { 
              key: 'subscriptions', 
              label: 'Abonnements Totaux',
              formatter: (row) => row.ventes_mensuelles.reduce((sum, sales) => sum + sales, 0)
            }
          ]}
        />
      </div>
    </div>
  );
};

export default SubscriptionDashboard;
