
import { useState } from 'react';
import { ArrowLeft, Heart } from 'lucide-react';
import { addToCart } from '../stores/cartStore.js'; // 2. Importa la action directamente 

// Ahora recibimos 'onBackHref' (una URL) en lugar de 'onBack' (una función)
const ProductDetail = ({ product, onBackHref }) => {
  const [quantity, setQuantity] = useState(1);
  const [wasAdded, setWasAdded] = useState(false); // Estado para feedback visual

  const { nombre, descripcion, imagen, notas_generales, precio } = product;

  const handleQuantityChange = (amount) => {
    setQuantity((prev) => Math.max(1, prev + amount));
  };

  const handleAddToCart = () => {
    addToCart(product, quantity); // 3. Llama a la action importada ¡Así de simple!
    setWasAdded(true);
    setTimeout(() => setWasAdded(false), 2000);
  };

  return (
    <div className="bg-white w-full">
      <div className="p-4 flex justify-between items-center sticky top-0 bg-white z-10 border-b">
        <a href={onBackHref} className="p-2">
          <ArrowLeft size={24} />
        </a>
        <h2 className="font-bold text-lg">Detalles</h2>
        <div className="size-10" />
      </div>

      <img src={imagen} alt={nombre} className="w-full h-64 object-cover" />
      <div className="p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">{nombre}</h1>
        <p className="text-gray-600 mb-6">{descripcion}</p>
        <h3 className="font-bold text-md">Nota</h3>
        <div className="flex flex-wrap gap-2 mb-8 text-sm">
          {notas_generales}
        </div>
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4 bg-gray-100 rounded-lg p-1">
            <button onClick={() => handleQuantityChange(-1)} className="text-2xl px-3 text-gray-600">-</button>
            <span className="font-bold text-lg w-8 text-center">{quantity}</span>
            <button onClick={() => handleQuantityChange(1)} className="text-2xl px-3 text-accent/60">+</button>
          </div>
          <p className="text-3xl font-bold text-gray-800">
            S/ {(precio * quantity).toFixed(2)}
          </p>
        </div>
        <button 
          onClick={handleAddToCart}
          className={`w-full py-4 rounded-xl text-lg font-bold transition-colors ${
            wasAdded 
              ? 'bg-secondary/50 text-white' 
              : 'bg-accent/50 hover:bg-accent/60'
          }`}
          disabled={wasAdded}
        >
          {wasAdded ? '¡Añadido!' : 'Añadir al carrito'}
        </button>
      </div>
    </div>
  );
};

export default ProductDetail;