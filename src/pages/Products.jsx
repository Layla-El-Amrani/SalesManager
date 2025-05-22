import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Plus, Search, Edit2, Trash2, X, Save, PlusCircle, Package, Upload } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { 
  addProduct, 
  updateProduct, 
  deleteProduct,
  selectAllProducts,
  selectFilteredProducts,
  selectCategories as selectCategoriesFromState
} from '../redux/slices/salesSlice';

const Products = () => {
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const products = useSelector(selectAllProducts);
  const filteredProducts = useSelector((state) => {
    let filtered = selectFilteredProducts(state, searchTerm);
    
    // Filtrer par catégorie si une catégorie est sélectionnée
    if (selectedCategory && selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.categorie === selectedCategory);
    }
    
    console.log('Produits filtrés:', filtered);
    return filtered;
  });
  const categories = useSelector(selectCategoriesFromState);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    reference: '',
    nom: '',
    categorie: '',
    prix: '',
    image: '',
    ventes_mensuelles: Array(12).fill(0)
  });



  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, files } = e.target;
    
    if (type === 'file') {
      const file = files[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setFormData(prev => ({
            ...prev,
            image: reader.result // Stocke l'image en base64
          }));
        };
        reader.readAsDataURL(file);
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: name === 'prix' ? parseFloat(value) || 0 : value
      }));
    }
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Préparer les données du produit
    const productData = {
      ...formData,
      prix: parseFloat(formData.prix) || 0,
      stock: parseInt(formData.stock) || 0,
      marge: parseFloat(formData.marge) || 0,
      ventes_mensuelles: formData.ventes_mensuelles.map(v => parseInt(v) || 0)
    };

    if (editingProduct) {
      // Mise à jour d'un produit existant
      dispatch(updateProduct({ 
        reference: editingProduct.reference, 
        updates: productData
      }));
    } else {
      // Création d'un nouveau produit
      const newProduct = {
        ...productData,
        reference: formData.reference || `REF-${Date.now()}`,
        date_creation: new Date().toISOString().split('T')[0]
      };
      dispatch(addProduct(newProduct));
    }
    
    handleCloseModal();
  };

  // Handle edit product
  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      reference: product.reference,
      nom: product.nom,
      categorie: product.categorie || '',
      prix: product.prix,
      image: product.image || '',
      stock: product.stock || 0,
      marge: product.marge || 0,
      description: product.description || '',
      ventes_mensuelles: [...(product.ventes_mensuelles || Array(12).fill(0))]
    });
    setIsModalOpen(true);
  };

  // Handle delete product
  const handleDelete = (reference) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      dispatch(deleteProduct(reference));
    }
  };

  // Close modal and reset form
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
    setFormData({
      reference: '',
      nom: '',
      categorie: '',
      prix: '',
      image: '',
      stock: 0,
      marge: 0,
      description: '',
      ventes_mensuelles: Array(12).fill(0)
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestion des Produits</h1>
          <p className="text-gray-600">Gérez vos produits et suivez leurs performances</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <Plus size={18} />
          Ajouter un produit
        </button>
      </div>

      {/* Filtres */}
      <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Filtre par catégorie */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Package className="h-5 w-5 text-gray-400" />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">Toutes les catégories</option>
            {categories.map((category, index) => (
              <option key={`cat-${index}`} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
        
        {/* Barre de recherche */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Rechercher un produit..."
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Products Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div key={product.id} className="relative group">
              <ProductCard product={product} />
              <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => handleEdit(product)}
                  className="p-2 bg-white rounded-full shadow-md hover:bg-blue-50 text-blue-600"
                  title="Modifier"
                >
                  <Edit2 size={16} />
                </button>
                <button
                  onClick={() => handleDelete(product.reference)}
                  className="p-2 bg-white rounded-full shadow-md hover:bg-red-50 text-red-600"
                  title="Supprimer"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Package size={48} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900">Aucun produit trouvé</h3>
          <p className="mt-1 text-gray-500">
            {searchTerm ? 'Aucun produit ne correspond à votre recherche.' : 'Commencez par ajouter votre premier produit.'}
          </p>
          {!searchTerm && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="mt-4 inline-flex items-center gap-2 text-blue-600 hover:text-blue-800"
            >
              <PlusCircle size={18} />
              Ajouter un produit
            </button>
          )}
        </div>
      )}

      {/* Add/Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-bold text-gray-900">
                {editingProduct ? 'Modifier le produit' : 'Ajouter un nouveau produit'}
              </h2>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Référence *
                  </label>
                  <input
                    type="text"
                    name="reference"
                    value={formData.reference}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    required
                    disabled={!!editingProduct}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nom du produit *
                  </label>
                  <input
                    type="text"
                    name="nom"
                    value={formData.nom}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Catégorie *
                  </label>
                  <select
                    name="categorie"
                    value={formData.categorie}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="">Sélectionner une catégorie</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Prix (MAD) *
                  </label>
                  <input
                    type="number"
                    name="prix"
                    min="0"
                    step="0.01"
                    value={formData.prix}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Stock
                  </label>
                  <input
                    type="number"
                    name="stock"
                    min="0"
                    value={formData.stock || 0}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Marge (%)
                  </label>
                  <input
                    type="number"
                    name="marge"
                    min="0"
                    max="100"
                    value={formData.marge || 0}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Image du produit
                  </label>
                  <div className="mt-1 flex items-center">
                    {formData.image ? (
                      <div className="relative">
                        <img
                          src={formData.image}
                          alt="Aperçu du produit"
                          className="h-20 w-20 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, image: '' }))}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center w-full">
                        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <Upload className="w-8 h-8 mb-2 text-gray-500" />
                            <p className="mb-2 text-sm text-gray-500">
                              <span className="font-semibold">Cliquez pour télécharger</span> ou glissez-déposez
                            </p>
                            <p className="text-xs text-gray-500">PNG, JPG (MAX. 2MB)</p>
                          </div>
                          <input 
                            type="file" 
                            name="image" 
                            className="hidden" 
                            accept="image/*"
                            onChange={handleInputChange}
                          />
                        </label>
                      </div>
                    )}
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description || ''}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ventes mensuelles (12 derniers mois)
                  </label>
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                    {formData.ventes_mensuelles.map((vente, index) => (
                      <div key={index} className="flex flex-col">
                        <span className="text-xs text-gray-500">M{index + 1}</span>
                        <input
                          type="number"
                          min="0"
                          value={vente}
                          onChange={(e) => {
                            const newVentes = [...formData.ventes_mensuelles];
                            newVentes[index] = parseInt(e.target.value) || 0;
                            setFormData(prev => ({
                              ...prev,
                              ventes_mensuelles: newVentes
                            }));
                          }}
                          className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500 text-center"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-8 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                >
                  <Save size={18} />
                  {editingProduct ? 'Mettre à jour' : 'Enregistrer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
