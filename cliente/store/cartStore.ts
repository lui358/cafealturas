import { create } from 'zustand';

// Interfaz para una opción de precio
interface OpcionPrecio {
  peso: string;
  valor: number;
}

// Interfaz para un item dentro del carrito
export interface CartItem {
  _id: string;
  nombre: string;
  opcionPrecio: OpcionPrecio;
  tostado: string;
  molido: string;
  cantidad: number;
}

// Interfaz para el estado completo de nuestro store
interface CartState {
  items: CartItem[];
  addItem: (itemToAdd: Omit<CartItem, 'cantidad'>) => void;
  removeItem: (itemId: string) => void;
  clearCart: () => void;
}

// Creamos el store con Zustand
export const useCartStore = create<CartState>((set) => ({
  items: [], // El carrito empieza vacío

  // Acción para añadir un item
  addItem: (itemToAdd) => set((state) => {
    const existingItem = state.items.find(
      (item) =>
        item._id === itemToAdd._id &&
        item.opcionPrecio.peso === itemToAdd.opcionPrecio.peso &&
        item.tostado === itemToAdd.tostado &&
        item.molido === itemToAdd.molido
    );

    if (existingItem) {
      // Si el item ya existe (mismo producto y mismas opciones), incrementamos la cantidad
      const updatedItems = state.items.map((item) =>
        item === existingItem ? { ...item, cantidad: item.cantidad + 1 } : item
      );
      return { items: updatedItems };
    } else {
      // Si es un item nuevo, lo añadimos al carrito con cantidad 1
      return { items: [...state.items, { ...itemToAdd, cantidad: 1 }] };
    }
  }),

  // Acción para eliminar un item (no la usaremos aún, pero es bueno tenerla)
  removeItem: (itemId) => set((state) => ({
    items: state.items.filter((item) => item._id !== itemId),
  })),

  // Acción para vaciar el carrito
  clearCart: () => set({ items: [] }),
}));