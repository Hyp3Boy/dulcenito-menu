import { useMemo, useState, useEffect } from "react";
import { useStore } from "@nanostores/react"; // 1. Importa useStore
import {
  cartItems,
  updateQuantity,
  removeFromCart,
} from "../stores/cartStore.js"; // 2. Importa el atom y las actions
import { ArrowLeft, Trash2 } from "lucide-react";

const WHATSAPP_PHONE_NUMBER = "51919759607"; // ¡Reemplaza con tu número!

const ShoppingCart = () => {
  const $cartItems = useStore(cartItems);
  // 2. Añade un estado para saber si el componente ya se montó en el cliente
  const [hasMounted, setHasMounted] = useState(false);

  // 3. Usa useEffect para cambiar el estado SÓLO después del primer render en el cliente
  useEffect(() => {
    setHasMounted(true);
  }, []); // El array vacío [] asegura que esto solo se ejecute una vez, al montar.

  const subtotal = useMemo(() => {
    return $cartItems.reduce(
      (total, item) => total + item.precio * item.quantity,
      0
    );
  }, [$cartItems]);

  const shippingCost = 5.0;
  const total = subtotal + shippingCost;

  const generateWhatsAppMessage = () => {
    // Encabezado del mensaje
    let message =
      "¡Hola! Quisiera pedir los siguientes productos de mi carrito:\n\n";
    // Agrega cada producto a la lista
    // Usamos Markdown de WhatsApp (*bold*) para que se vea más bonito
    $cartItems.forEach((item) => {
      const itemTotal = (item.precio * item.quantity).toFixed(2);
      message += `*${item.quantity}x ${item.nombre}* - S/.${itemTotal}\n`;
    });

    // Agrega el resumen final
    message += "\n--------------------\n";
    message += `*Subtotal:* S/.${subtotal.toFixed(2)}\n`;
    message += `*Envío:* S/.${shippingCost.toFixed(2)}\n`;
    message += `*Total:* *S/.${total.toFixed(2)}*\n\n`;
    message += "¡Quedo a la espera de su respuesta!";

    // 3. Retorna el mensaje codificado para la URL
    return encodeURIComponent(message);
  };

  // 4. Si el componente aún no se ha montado en el cliente, no renderices nada (o un esqueleto de carga).
  // Esto asegura que el render del servidor y el primer render del cliente coincidan.
  if (!hasMounted) {
    return null; // O puedes retornar un componente de "Cargando..."
  }

  // A partir de aquí, el código sabe que está en el cliente y puede acceder a localStorage de forma segura.
  if ($cartItems.length === 0) {
    return (
      <div className="text-center py-20">
        <h1 className="text-2xl font-bold mb-2">Tu carrito está vacío</h1>
        <p className="text-gray-500 mb-6">
          Parece que aún no has añadido nada.
        </p>
        <a
          href="/"
          className="bg-secondary/50 text-white font-bold py-3 px-6 rounded-lg">
          Volver a la tienda
        </a>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 p-4 rounded-lg min-h-screen">
      <div className="flex justify-between items-center sticky top-0 z-10 pb-4">
        <a href="/" className="p-2">
          <ArrowLeft size={24} />
        </a>
        <h2 className="font-bold text-lg">Mi Carrito</h2>
        <div className="size-10" />
      </div>

      {/* Lista de Items */}
      <div className="space-y-4">
        {$cartItems.map((item) => (
          <div
            key={item.id_producto}
            className="bg-white p-4 rounded-lg shadow-sm flex items-center gap-4">
            <img
              src={item.imagen}
              alt={item.nombre}
              className="w-16 h-16 object-cover rounded-md"
            />
            <div className="grow">
              <h2 className="font-bold">{item.nombre}</h2>
              <p className="font-semibold text-sm mt-1">
                S/.{item.precio.toFixed(2)}
              </p>
            </div>
            <div className="flex flex-col justify-end items-end gap-5">
              <button
                onClick={() => removeFromCart(item.id_producto)}
                className="text-gray-400 hover:text-red-500">
                <Trash2 size={20} />
              </button>
              <div className="flex items-center gap-2 bg-gray-100 rounded-full">
                <button
                  onClick={() =>
                    updateQuantity(item.id_producto, item.quantity - 1)
                  }
                  className="px-2 py-1">
                  -
                </button>
                <span>{item.quantity}</span>
                <button
                  onClick={() =>
                    updateQuantity(item.id_producto, item.quantity + 1)
                  }
                  className="px-2 py-1">
                  +
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Resumen de Costos */}
      <div className="bg-white p-6 rounded-lg shadow-sm mt-8">
        <div className="space-y-3 text-gray-600">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span className="font-semibold">S/.{subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Envío</span>
            <span className="font-semibold">S/.{shippingCost.toFixed(2)}</span>
          </div>
        </div>
        <div className="border-t my-4"></div>
        <div className="flex justify-between font-bold text-lg text-black">
          <span>Total</span>
          <span>S/.{total.toFixed(2)}</span>
        </div>
      </div>
      <a
        href={`https://wa.me/${WHATSAPP_PHONE_NUMBER}?text=${generateWhatsAppMessage()}`}
        target="_blank"
        rel="noopener noreferrer"
        className="block text-center w-full bg-accent/50 py-4 rounded-xl text-lg font-bold text-black hover:bg-accent/60 transition-colors mt-6">
        Continuar con el Pago
      </a>
    </div>
  );
};

export default ShoppingCart;
