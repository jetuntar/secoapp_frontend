import create from 'zustand';

const useStore = create(set => ({
  coffeeList: [],
  beanList: [],
  cart: [],
  favoriteList: [],
  historyList: [],
  total: 0,
  addToCart: (item: any) => set((state: { cart: any; }) => ({ cart: [...state.cart, item] })),
  calculateCartPrice: () => set((state: { cart: any[]; }) => {
    let total = 0;
    state.cart.forEach((item: { price: number; }) => {
      total += item.price;
    });
    return { total };
  }),addToFavoriteList: (item: any) => set((state: { favoriteList: any; }) => ({ favoriteList: [...state.favoriteList, item] })),
  deleteFromFavoriteList: (itemId: any) => set((state: { favoriteList: any[]; }) => {
    const newFavoriteList = state.favoriteList.filter((item: { id: any; }) => item.id !== itemId);
    return { favoriteList: newFavoriteList };
  }),
  incrementCartItemQuantity: (itemId: any) => set((state: { cart: any[]; }) => {
    const newCart = state.cart.map((item: { id: any; quantity: number; }) => 
      item.id === itemId ? { ...item, quantity: item.quantity + 1 } : item
    );
    return { cart: newCart };
  }),
  decrementCartItemQuantity: (itemId: any) => set((state: { cart: any[]; }) => {
    const newCart = state.cart.map((item: { id: any; quantity: number; }) => 
      item.id === itemId && item.quantity > 0 ? { ...item, quantity: item.quantity - 1 } : item
    );
    return { cart: newCart };
  }),
  addToHistoryListFromCart: () => set((state: { historyList: any; cart: any; }) => {
    const newHistoryList = [...state.historyList, ...state.cart];
    return { historyList: newHistoryList, cart: [] };
  }),
}));

export default useStore;
