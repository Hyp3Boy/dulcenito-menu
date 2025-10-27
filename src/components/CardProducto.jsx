
const CardProducto = ({ producto }) => {
  const { id_producto, nombre, precio, imagen } = producto;
  const displayPrice = (typeof precio === 'number' ? precio : 0).toFixed(2);

  return (
    <a href={`/producto/${id_producto}`} className="bg-white rounded-2xl shadow-lg overflow-hidden h-full flex flex-col no-underline">
      <img src={imagen} alt={nombre} className="w-full h-32 object-cover" />

      <div className="p-3 flex flex-col grow">
        <h4 className="font-semibold text-md text-gray-800 grow">{nombre}</h4>
        <p className="text-gray-600 mt-1">${displayPrice}</p>
        
        <div className="mt-3 w-full bg-[#E5007E] text-white py-2.5 rounded-xl font-bold text-center">
          <i className="fas fa-shopping-cart"></i>
        </div>
      </div>
    </a>
  );
};

export default CardProducto;