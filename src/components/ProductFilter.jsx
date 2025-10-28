// src/components/ProductFilter.jsx
import { useState, useEffect } from 'react';
import CardProducto from './CardProducto.jsx';
import ProductDetail from './ProductDetail.jsx';

const ProductFilter = ({ categories, products }) => {
  // --- ESTADOS ---
  const [selectedCategory, setSelectedCategory] = useState(categories?.[0]?.id_categoria);
  const [viewedProduct, setViewedProduct] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(4); 

  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 768px)');
    
    const handleResize = () => {
      setItemsPerPage(mediaQuery.matches ? 6 : 4);
    };

    handleResize(); 
    mediaQuery.addEventListener('change', handleResize); 

    return () => mediaQuery.removeEventListener('change', handleResize); // Limpieza
  }, []);

  const filteredProducts = products.filter(p => p.id_categoria === selectedCategory);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, endIndex);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory]);
  
  // --- MANEJADORES DE EVENTOS ---
  const handleCategoryClick = (categoryId) => {
    setSelectedCategory(categoryId);
  };

  const handleProductSelect = (product) => {
    setViewedProduct(product); 
  };

  const handleBackToList = () => {
    setViewedProduct(null); 
  };
  
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // --- RENDERIZADO ---
  if (viewedProduct) {
    return <ProductDetail product={viewedProduct} onBack={handleBackToList} />;
  }

  return (
    <div>
      {/* --- Filtro de Categorías (sin cambios) --- */}
      <div className="flex space-x-4 mb-6 overflow-x-auto pb-3">
        {categories.map((category) => (
          <button
            key={category.id_categoria}
            onClick={() => handleCategoryClick(category.id_categoria)}
            className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
              selectedCategory === category.id_categoria
                ? "bg-secondary text-white"
                : "bg-secondary/20 text-gray-700"
            }`}>
            {category.nombre}
          </button>
        ))}
      </div>

      {currentProducts.length > 0 ? (
        <>
          {/* --- La nueva Cuadrícula (Grid) de Productos --- */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {currentProducts.map((producto) => (
              <CardProducto
                key={producto.id_producto}
                producto={producto}
                onProductSelect={handleProductSelect}
              />
            ))}
          </div>

          {/* --- Paginación con Puntos (si hay más de 1 página) --- */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 my-6">
              {Array.from({ length: totalPages }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => handlePageChange(index + 1)}
                  className={`w-2.5 h-2.5 rounded-full transition-colors duration-300 ${
                    // Compara el index+1 con la página actual para el estilo activo
                    index + 1 === currentPage ? 'bg-secondary' : 'bg-secondary/30'
                  }`}
                />
              ))}
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-10 px-4">
          <p className="font-bold text-gray-700">No hay productos disponibles</p>
          <p className="text-sm text-gray-500 mt-1">Prueba a seleccionar otra categoría.</p>
        </div>
      )}
    </div>
  );
};

export default ProductFilter;