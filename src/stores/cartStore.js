
import { atom } from 'nanostores';

// 1. EL "ATOM": ESTA ES TU VARIABLE GLOBAL
// Intenta cargar el estado inicial desde localStorage para que sea persistente.
const getInitialCart = () => {
  try {
    const storedCart = localStorage.getItem('dulcenito_cart');
    // Si hay algo guardado, úsalo; si no, empieza con un array vacío.
    return storedCart ? JSON.parse(storedCart) : [];
  } catch {
    // Si hay algún error (ej. JSON malformado), empieza de cero.
    return [];
  }
};

export const cartItems = atom(getInitialCart());

// 2. SINCRONIZACIÓN CON LOCALSTORAGE
// Esta función se ejecuta automáticamente CADA VEZ que `cartItems` cambia.
cartItems.listen(items => {
  try {
    localStorage.setItem('dulcenito_cart', JSON.stringify(items));
  } catch (error) {
    console.error("Error al guardar el carrito en localStorage", error);
  }
});

// 3. LAS "ACTIONS": FUNCIONES GLOBALES PARA MODIFICAR EL ESTADO
// Estas funciones se pueden importar y usar desde CUALQUIER componente.

export function addToCart(product, quantity) {
  const currentItems = cartItems.get(); // Obtiene el valor actual del atom
  const itemExists = currentItems.find(item => item.id_producto === product.id_producto);

  if (itemExists) {
    // Si el producto ya está, actualiza su cantidad
    const updatedItems = currentItems.map(item =>
      item.id_producto === product.id_producto
        ? { ...item, quantity: item.quantity + quantity }
        : item
    );
    cartItems.set(updatedItems); // Establece el nuevo valor del atom
  } else {
    // Si es un producto nuevo, añádelo a la lista
    cartItems.set([...currentItems, { ...product, quantity }]);
  }
}

export function updateQuantity(productId, newQuantity) {
  const currentItems = cartItems.get();
  // Si la nueva cantidad es 0 o menos, elimina el producto
  if (newQuantity < 1) {
    cartItems.set(currentItems.filter(item => item.id_producto !== productId));
  } else {
    // Si no, actualiza la cantidad del producto específico
    const updatedItems = currentItems.map(item =>
      item.id_producto === productId ? { ...item, quantity: newQuantity } : item
    );
    cartItems.set(updatedItems);
  }
}

export function removeFromCart(productId) {
  const currentItems = cartItems.get();
  cartItems.set(currentItems.filter(item => item.id_producto !== productId));
}