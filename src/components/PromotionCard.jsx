
const PromotionCard = ({ promotion }) => {
  return (
    <div className="shrink-0 w-full pl-4">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden h-full">
        <img 
          src={promotion.imagen} 
          alt={promotion.titulo} 
          className="w-full h-32 md:h-52 object-cover rounded-t-xl"
        />
        
        <div className="p-4">
          <h2 className="font-bold text-secondary text-brand-text mb-1">
            {promotion.titulo}
          </h2>
          <p className="text-sm text-gray-500 leading-tight">
            {promotion.descripcion}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PromotionCard;