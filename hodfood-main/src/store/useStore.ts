import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { collection, addDoc, updateDoc, doc, onSnapshot, query } from 'firebase/firestore';
import { db } from '../firebase';
import type {
  MenuItem, CartItem, Order, AppMode, AdminSection,
  OrderStatus, Category, User, OrderType, StatsFilter,
} from '../types';
import { INITIAL_MENU } from '../data/menuData';

function makeId() { return Math.random().toString(36).slice(2, 8).toUpperCase(); }
function makeCode() { return String(Math.floor(1000 + Math.random() * 9000)); }

interface PendingOrder {
  items: CartItem[];
  customerName: string;
  phone: string;
  address: string;
  orderType: OrderType;
  paymentMethod: 'cash' | 'card';
  cardNumber?: string;
  expiryDate?: string;
  branch: string;
  total: number;
}

interface AppState {
  mode: AppMode;
  setMode: (mode: AppMode) => void;
  user: User | null;
  loginModalOpen: boolean;
  profileOpen: boolean;
  mobileMenuOpen: boolean;
  setLoginModalOpen: (open: boolean) => void;
  login: (user: User) => void;
  logout: () => void;
  setProfileOpen: (open: boolean) => void;
  setMobileMenuOpen: (open: boolean) => void;
  menuItems: MenuItem[];
  addMenuItem: (item: Omit<MenuItem, 'id'>) => void;
  updateMenuItem: (id: string, updates: Partial<Omit<MenuItem, 'id'>>) => void;
  deleteMenuItem: (id: string) => void;
  cart: CartItem[];
  addToCart: (item: MenuItem, spicySauce: boolean) => void;
  removeFromCart: (itemId: string, spicySauce: boolean) => void;
  clearCart: () => void;
  cartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  customerTab: 'menu' | 'history';
  setCustomerTab: (tab: 'menu' | 'history') => void;
  activeCategory: Category | 'all';
  setActiveCategory: (cat: Category | 'all') => void;
  checkoutOpen: boolean;
  setCheckoutOpen: (open: boolean) => void;
  orderType: OrderType;
  setOrderType: (type: OrderType) => void;
  smsModalOpen: boolean;
  smsCode: string;
  pendingOrder: PendingOrder | null;
  receiptOrder: Order | null;
  initiateSMS: (orderData: PendingOrder) => Promise<void>;
  confirmSMS: (inputCode: string) => Promise<boolean>;
  closeReceipt: () => void;
  orders: Order[];
  updateOrderStatus: (orderId: string, status: OrderStatus) => Promise<void>;
  listenToOrders: () => void;
  currentBranch: string | null;
  setCurrentBranch: (branch: string | null) => void;
  branchTab: 'orders' | 'history';
  setBranchTab: (tab: 'orders' | 'history') => void;
  adminSection: AdminSection;
  setAdminSection: (section: AdminSection) => void;
  statsFilter: StatsFilter;
  setStatsFilter: (filter: StatsFilter) => void;
  statsBranch: string;
  setStatsBranch: (branch: string) => void;
  selectedBranchModal: string | null;
  setSelectedBranchModal: (branch: string | null) => void;
}

// PERSIST (Xotira) qo'shilgan versiyasi
export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      mode: 'customer',
      setMode: (mode) => set({ mode }),

      user: null,
      loginModalOpen: false,
      profileOpen: false,
      mobileMenuOpen: false,
      setLoginModalOpen: (open) => set({ loginModalOpen: open }),
      login: (user) => set({ user, loginModalOpen: false }),
      logout: () => set({ user: null, profileOpen: false }),
      setProfileOpen: (open) => set({ profileOpen: open }),
      setMobileMenuOpen: (open) => set({ mobileMenuOpen: open }),

      menuItems: INITIAL_MENU,
      addMenuItem: (item) => set((s) => ({ menuItems: [...s.menuItems, { ...item, id: makeId() }] })),
      updateMenuItem: (id, updates) => set((s) => ({ menuItems: s.menuItems.map((m) => (m.id === id ? { ...m, ...updates } : m)) })),
      deleteMenuItem: (id) => set((s) => ({ menuItems: s.menuItems.filter((m) => m.id !== id) })),

      cart: [],
      addToCart: (item, spicySauce) =>
        set((s) => {
          const existing = s.cart.find((c) => c.menuItem.id === item.id && c.spicySauce === spicySauce);
          if (existing) {
            return { cart: s.cart.map((c) => c.menuItem.id === item.id && c.spicySauce === spicySauce ? { ...c, quantity: c.quantity + 1 } : c) };
          }
          return { cart: [...s.cart, { menuItem: item, quantity: 1, spicySauce }] };
        }),
      removeFromCart: (itemId, spicySauce) =>
        set((s) => {
          const existing = s.cart.find((c) => c.menuItem.id === itemId && c.spicySauce === spicySauce);
          if (!existing) return s;
          if (existing.quantity === 1) return { cart: s.cart.filter((c) => !(c.menuItem.id === itemId && c.spicySauce === spicySauce)) };
          return { cart: s.cart.map((c) => c.menuItem.id === itemId && c.spicySauce === spicySauce ? { ...c, quantity: c.quantity - 1 } : c) };
        }),
      clearCart: () => set({ cart: [] }),
      cartOpen: false,
      setCartOpen: (open) => set({ cartOpen: open }),

      customerTab: 'menu',
      setCustomerTab: (tab) => set({ customerTab: tab }),
      activeCategory: 'all',
      setActiveCategory: (cat) => set({ activeCategory: cat }),

      checkoutOpen: false,
      setCheckoutOpen: (open) => set({ checkoutOpen: open }),
      orderType: 'delivery',
      setOrderType: (type) => set({ orderType: type }),

      smsModalOpen: false,
      smsCode: '',
      pendingOrder: null,
      receiptOrder: null,

      initiateSMS: async (orderData) => {
        if (orderData.paymentMethod === 'cash') {
          const newOrderData = { ...orderData, status: 'new', createdAt: new Date().toISOString() };
          try {
            const docRef = await addDoc(collection(db, 'orders'), newOrderData);
            const newOrder: Order = { ...newOrderData, id: docRef.id, createdAt: new Date() } as Order;
            set(() => ({ cart: [], checkoutOpen: false, receiptOrder: newOrder }));
          } catch (error) {
            console.error("Firebase'ga saqlashda xatolik:", error);
          }
        } else {
          const code = makeCode();
          set({ pendingOrder: orderData, smsCode: code, smsModalOpen: true, checkoutOpen: false });
        }
      },

      confirmSMS: async (inputCode) => {
        const { smsCode, pendingOrder } = get();
        if (inputCode !== smsCode) return false;
        if (!pendingOrder) return false;

        const newOrderData = { ...pendingOrder, status: 'new', createdAt: new Date().toISOString() };
        try {
          const docRef = await addDoc(collection(db, 'orders'), newOrderData);
          const newOrder: Order = { ...newOrderData, id: docRef.id, createdAt: new Date() } as Order;
          set(() => ({ cart: [], smsModalOpen: false, pendingOrder: null, receiptOrder: newOrder }));
          return true;
        } catch (error) {
          console.error("Firebase'ga saqlashda xatolik:", error);
          return false;
        }
      },

      closeReceipt: () => set({ receiptOrder: null }),

      orders: [],

      updateOrderStatus: async (orderId, status) => {
        set((s) => ({ orders: s.orders.map((o) => (o.id === orderId ? { ...o, status } : o)) }));
        try {
          const orderRef = doc(db, 'orders', orderId);
          await updateDoc(orderRef, { status });
        } catch (error) {
          console.error("Statusni bazada yangilashda xatolik:", error);
        }
      },

      listenToOrders: () => {
        const q = query(collection(db, 'orders'));
        onSnapshot(q, (snapshot) => {
          const fetchedOrders: Order[] = [];
          snapshot.forEach((docSnap) => {
            const data = docSnap.data();
            fetchedOrders.push({
              ...data,
              id: docSnap.id,
              createdAt: new Date(data.createdAt),
            } as Order);
          });
          fetchedOrders.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
          set({ orders: fetchedOrders });
        });
      },

      currentBranch: null,
      setCurrentBranch: (branch) => set({ currentBranch: branch }),
      branchTab: 'orders',
      setBranchTab: (tab) => set({ branchTab: tab }),

      adminSection: 'dashboard',
      setAdminSection: (section) => set({ adminSection: section }),
      statsFilter: 'daily',
      setStatsFilter: (filter) => set({ statsFilter: filter }),
      statsBranch: 'all',
      setStatsBranch: (branch) => set({ statsBranch: branch }),
      selectedBranchModal: null,
      setSelectedBranchModal: (branch) => set({ selectedBranchModal: branch }),
    }),
    {
      name: 'hodfood-storage', // Xotiraga shu nom bilan saqlanadi
      partialize: (state) => ({
        // Faqat kerakli narsalarni doimiy saqlaymiz (refresh bo'lganda o'chmaydi)
        cart: state.cart,
        user: state.user,
        mode: state.mode,
        currentBranch: state.currentBranch
      }),
    }
  )
);

// Dastur ishga tushishi bilan bazani o'qish
useStore.getState().listenToOrders();