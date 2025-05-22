import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { BarChart3, ShoppingCart, Package2, Filter, ChevronDown, Users, TrendingUp, TrendingDown, DollarSign, Clock, MapPin, Calendar, UserPlus, UserMinus, UserCheck, UserX, User, Settings, BarChart2 } from 'lucide-react';
import CustomTable from './CustomTable';

// Define constants for months and colors
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

const EnhancedDashboard = () => {
  const dispatch = useDispatch();
  const { data, selectedCategory, activeTab } = useSelector(state => state.sales);

  useEffect(() => {
    dispatch(setActiveTab('enhanced'));
  }, [dispatch]);

  // Prepare data for the pie chart
  const pieData = data.map(product => ({
    name: product.nom,
    value: product.ventes_mensuelles.reduce((sum, sales) => sum + (sales * product.prix), 0)
  }));

  // Prepare data for the line chart
  const lineData = MONTHS.map((month, idx) => ({
    month,
    ...data.reduce((acc, product) => ({
      ...acc,
      [product.nom]: product.ventes_mensuelles[idx] * product.prix
    }), {})
  }));

  // Get unique categories from data
  const categories = ['all', ...new Set(data.map(product => product.categorie))];

  // Calculate statistics
  const totalRevenue = data.reduce((sum, product) => 
    sum + product.ventes_mensuelles.reduce((s, sales) => s + (sales * product.prix), 0), 0
  );
  
  const totalSales = data.reduce((sum, product) => 
    sum + product.ventes_mensuelles.reduce((s, sales) => s + sales, 0), 0
  );

  // Calculate trends
  const lastMonthSales = data.reduce((sum, product) => 
    sum + product.ventes_mensuelles[11] * product.prix, 0
  );
  
  const previousMonthSales = data.reduce((sum, product) => 
    sum + product.ventes_mensuelles[10] * product.prix, 0
  );

  const salesTrend = ((lastMonthSales - previousMonthSales) / previousMonthSales) * 100;

  // Customer statistics
  const customerStats = {
    total: 1234,
    new: 256,
    returning: 978,
    churn: 45,
    satisfaction: 85
  };

  // Location data
  const locationData = [
    { location: 'Casablanca', sales: 450000, customers: 350 },
    { location: 'Rabat', sales: 320000, customers: 280 },
    { location: 'Marrakech', sales: 280000, customers: 220 },
    { location: 'Fès', sales: 210000, customers: 180 },
    { location: 'Tanger', sales: 180000, customers: 150 }
  ];

  return (
    <div className="min-h-screen w-full p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Tableau de Bord Complet</h1>
        <div className="relative">
          <select 
            value={selectedCategory} 
            onChange={(e) => dispatch(setSelectedCategory(e.target.value))}
            className="appearance-none pl-10 pr-10 py-2.5 bg-white border border-gray-300 rounded-lg shadow-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-medium"
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category === 'all' ? 'Toutes les catégories' : category}
              </option>
            ))}
          </select>
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
          <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="card hover:shadow-md transition-shadow duration-300">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Chiffre d&apos;Affaires Total</h3>
              <p className="text-2xl font-bold text-gray-900 mt-2">{totalRevenue.toLocaleString()} MAD</p>
              <p className="mt-2 text-sm font-medium text-green-600">
                <TrendingUp className="inline w-4 h-4 mr-1" />
                {salesTrend.toFixed(1)}% depuis le mois dernier
              </p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <BarChart3 className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="card hover:shadow-md transition-shadow duration-300">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Ventes Totales</h3>
              <p className="text-2xl font-bold text-gray-900 mt-2">{totalSales.toLocaleString()} unités</p>
              <p className="mt-2 text-sm font-medium text-green-600">
                <TrendingUp className="inline w-4 h-4 mr-1" />
                +12% depuis le mois dernier
              </p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <ShoppingCart className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="card hover:shadow-md transition-shadow duration-300">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Clients Actifs</h3>
              <p className="text-2xl font-bold text-gray-900 mt-2">{customerStats.total}</p>
              <p className="mt-2 text-sm font-medium text-green-600">
                <UserCheck className="inline w-4 h-4 mr-1" />
                {customerStats.satisfaction}% satisfaction
              </p>
            </div>
            <div className="p-3 bg-yellow-50 rounded-lg">
              <Users className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Taux de Conversion</h3>
              <p className="text-2xl font-bold text-gray-900 mt-2">{((totalSales / 1000) * 100).toFixed(1)}%</p>
              <p className="mt-2 text-sm font-medium text-green-600">
                <TrendingUp className="inline w-4 h-4 mr-1" />
                +8% depuis le mois dernier
              </p>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        {/* Sales Evolution */}
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Évolution des Ventes</h2>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={lineData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              {data.map((product, index) => (
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

        {/* Revenue Distribution */}
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Distribution des Revenus</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie 
                data={pieData}
                cx="50%"
                cy="50%"
                outerRadius={100}
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

        {/* Customer Growth */}
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Évolution des Clients</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 mb-2">
                <UserPlus className="inline w-6 h-6 mr-2" />
                {customerStats.new}
              </div>
              <p className="text-gray-600">Nouveaux Clients</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600 mb-2">
                <UserMinus className="inline w-6 h-6 mr-2" />
                {customerStats.churn}
              </div>
              <p className="text-gray-600">Clients Perdus</p>
            </div>
          </div>
        </div>
      </div>

      {/* Location and Time Performance */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {/* Location Performance */}
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Performance par Région</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {locationData.map((location, index) => (
              <div key={location.location} className="p-4 bg-white rounded-lg shadow">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium text-gray-900">{location.location}</h3>
                    <p className="text-sm text-gray-600">{location.customers} clients</p>
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{location.sales.toLocaleString()} MAD</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Time Performance */}
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Performance Temporelle</h2>
          <div className="grid grid-cols-1 gap-4">
            <div className="p-4 bg-white rounded-lg shadow">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium text-gray-900">Meilleure Heure</h3>
                  <p className="text-sm text-gray-600">14:00 - 16:00</p>
                </div>
                <div className="text-2xl font-bold text-green-600">35% des ventes</div>
              </div>
            </div>
            <div className="p-4 bg-white rounded-lg shadow">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium text-gray-900">Meilleur Jour</h3>
                  <p className="text-sm text-gray-600">Vendredi</p>
                </div>
                <div className="text-2xl font-bold text-green-600">28% des ventes</div>
              </div>
            </div>
            <div className="p-4 bg-white rounded-lg shadow">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium text-gray-900">Meilleur Mois</h3>
                  <p className="text-sm text-gray-600">Mai</p>
                </div>
                <div className="text-2xl font-bold text-green-600">32% des ventes</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-xl shadow-sm">
        <h2 className="text-xl font-semibold text-gray-900 p-6 mb-4">Détails des Produits</h2>
        <CustomTable 
          data={data}
          columns={[
            { key: 'nom', label: 'Nom du Produit' },
            { key: 'prix', label: 'Prix', formatter: (value) => `${value} MAD` },
            { key: 'categorie', label: 'Catégorie' },
            { 
              key: 'revenue', 
              label: 'Revenu Total',
              formatter: (row) => {
                const total = row.ventes_mensuelles.reduce((sum, sales) => sum + (sales * row.prix), 0);
                return `${total.toLocaleString()} MAD`;
              }
            },
            { 
              key: 'sales', 
              label: 'Ventes Totales',
              formatter: (row) => row.ventes_mensuelles.reduce((sum, sales) => sum + sales, 0)
            },
            { 
              key: 'growth', 
              label: 'Croissance',
              formatter: (row) => {
                const lastMonth = row.ventes_mensuelles[11] * row.prix;
                const prevMonth = row.ventes_mensuelles[10] * row.prix;
                const growth = ((lastMonth - prevMonth) / prevMonth) * 100;
                return (
                  <span className={`font-medium ${growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {growth.toFixed(1)}%
                  </span>
                );
              }
            }
          ]}
        />
      </div>
    </div>
  );
};

export default EnhancedDashboard;
