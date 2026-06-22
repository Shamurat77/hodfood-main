import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { collection, addDoc, updateDoc, doc, deleteDoc, onSnapshot, query, DocumentReference, type DocumentData } from 'firebase/firestore';
import { db } from '../firebase';
import type {
  MenuItem, CartItem, Order, AppMode, AdminSection,
  OrderStatus, Category, User, OrderType, StatsFilter, AppUser,
} from '../types';

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
  userEmail?: string;
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
  addMenuItem: (item: Omit<MenuItem, 'id'>) => Promise<void>;
  updateMenuItem: (id: string, updates: Partial<Omit<MenuItem, 'id'>>) => Promise<void>;
  deleteMenuItem: (id: string) => Promise<void>;
  listenToMenuItems: () => void;

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

  appUsers: AppUser[];
  listenToUsers: () => void;
  selectedUserModal: string | null;
  setSelectedUserModal: (email: string | null) => void;

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


  branchesList: { id: string, name: string }[];
  addBranch: (name: string) => Promise<void>;
  deleteBranch: (id: string) => Promise<void>;
  listenToBranches: () => void;
}

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
      login: async (user) => {
        set({ user, loginModalOpen: false });
        // Foydalanuvchini Firestore'ga saqlash
        try {
          const now = new Date().toISOString();
          await setDoc(
            doc(db, 'users', user.email),
            {
              uid: user.email,
              name: user.name,
              email: user.email,
              avatar: user.avatar,
              lastSeen: now,
              firstSeen: now,
            },
            { merge: true }
          );
        } catch (e) {
          console.error('User saqlashda xatolik:', e);
        }
      },
      logout: () => set({ user: null, profileOpen: false }),
      setProfileOpen: (open) => set({ profileOpen: open }),
      setMobileMenuOpen: (open) => set({ mobileMenuOpen: open }),

      menuItems: [],
      addMenuItem: async (item) => {
        try {
          await addDoc(collection(db, 'menuItems'), item);
        } catch (error) {
          console.error("Menyu qo'shishda xatolik:", error);
        }
      },
      updateMenuItem: async (id, updates) => {
        try {
          await updateDoc(doc(db, 'menuItems', id), updates as Record<string, unknown>);
        } catch (error) {
          console.error('Menyu yangilashda xatolik:', error);
        }
      },
      deleteMenuItem: async (id) => {
        try {
          await deleteDoc(doc(db, 'menuItems', id));
        } catch (error) {
          console.error("Menyu o'chirishda xatolik:", error);
        }
      },
      listenToMenuItems: () => {
        const q = query(collection(db, 'menuItems'));
        onSnapshot(q, (snapshot) => {
          const fetchedItems: MenuItem[] = snapshot.docs.map((docSnap) => ({
            ...docSnap.data(),
            id: docSnap.id,
          })) as MenuItem[];
          set({ menuItems: fetchedItems });
        });
      },

      cart: [],
      addToCart: (item, spicySauce) =>
        set((s) => {
          const existing = s.cart.find(
            (c) => c.menuItem.id === item.id && c.spicySauce === spicySauce
          );
          if (existing) {
            return {
              cart: s.cart.map((c) =>
                c.menuItem.id === item.id && c.spicySauce === spicySauce
                  ? { ...c, quantity: c.quantity + 1 }
                  : c
              ),
            };
          }
          return { cart: [...s.cart, { menuItem: item, quantity: 1, spicySauce }] };
        }),
      removeFromCart: (itemId, spicySauce) =>
        set((s) => {
          const existing = s.cart.find(
            (c) => c.menuItem.id === itemId && c.spicySauce === spicySauce
          );
          if (!existing) return s;
          if (existing.quantity === 1) {
            return {
              cart: s.cart.filter(
                (c) => !(c.menuItem.id === itemId && c.spicySauce === spicySauce)
              ),
            };
          }
          return {
            cart: s.cart.map((c) =>
              c.menuItem.id === itemId && c.spicySauce === spicySauce
                ? { ...c, quantity: c.quantity - 1 }
                : c
            ),
          };
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
        const { user } = get();
        const enriched = { ...orderData, userEmail: user?.email ?? '' };
        if (orderData.paymentMethod === 'cash') {
          const newOrderData = { ...enriched, status: 'new', createdAt: new Date().toISOString() };
          try {
            const docRef = await addDoc(collection(db, 'orders'), newOrderData);
            const newOrder: Order = {
              ...newOrderData,
              id: docRef.id,
              createdAt: new Date(),
            } as Order;
            set({ cart: [], checkoutOpen: false, receiptOrder: newOrder });
          } catch (error) {
            console.error("Firebase'ga saqlashda xatolik:", error);
          }
        } else {
          const code = makeCode();
          set({ pendingOrder: enriched, smsCode: code, smsModalOpen: true, checkoutOpen: false });
        }
      },

      confirmSMS: async (inputCode) => {
        const { smsCode, pendingOrder } = get();
        if (inputCode !== smsCode) return false;
        if (!pendingOrder) return false;
        const newOrderData = { ...pendingOrder, status: 'new', createdAt: new Date().toISOString() };
        try {
          const docRef = await addDoc(collection(db, 'orders'), newOrderData);
          const newOrder: Order = {
            ...newOrderData,
            id: docRef.id,
            createdAt: new Date(),
          } as Order;
          set({ cart: [], smsModalOpen: false, pendingOrder: null, receiptOrder: newOrder });
          return true;
        } catch (error) {
          console.error("Firebase'ga saqlashda xatolik:", error);
          return false;
        }
      },

      closeReceipt: () => set({ receiptOrder: null }),

      orders: [],
      updateOrderStatus: async (orderId, status) => {
        set((s) => ({
          orders: s.orders.map((o) => (o.id === orderId ? { ...o, status } : o)),
        }));
        try {
          await updateDoc(doc(db, 'orders', orderId), { status });
        } catch (error) {
          console.error('Statusni bazada yangilashda xatolik:', error);
        }
      },
      listenToOrders: () => {
        const q = query(collection(db, 'orders'));
        onSnapshot(q, (snapshot) => {
          const fetchedOrders: Order[] = snapshot.docs.map((docSnap) => {
            const data = docSnap.data();
            return {
              ...data,
              id: docSnap.id,
              createdAt: new Date(data.createdAt),
            } as Order;
          });
          fetchedOrders.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
          set({ orders: fetchedOrders });
        });
      },

      // ─── FOYDALANUVCHILAR ───────────────────────────────────────────
      appUsers: [],
      selectedUserModal: null,
      setSelectedUserModal: (email) => set({ selectedUserModal: email }),
      listenToUsers: () => {
        const q = query(collection(db, 'users'));
        onSnapshot(q, (snapshot) => {
          const users: AppUser[] = snapshot.docs.map((docSnap) => {
            const d = docSnap.data();
            return {
              uid: d.uid ?? docSnap.id,
              name: d.name ?? '',
              email: d.email ?? docSnap.id,
              avatar: d.avatar ?? '',
              firstSeen: d.firstSeen ?? '',
              lastSeen: d.lastSeen ?? '',
              totalOrders: 0,
              totalSpent: 0,
            };
          });
          // Buyurtmalar bilan boyitish
          const { orders } = get();
          const enriched = users.map((u) => {
            const userOrders = orders.filter((o) => o.userEmail === u.email);
            return {
              ...u,
              totalOrders: userOrders.length,
              totalSpent: userOrders.reduce((s, o) => s + o.total, 0),
            };
          });
          set({ appUsers: enriched });
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


      branchesList: [],

addBranch: async (name) => {
  try {
    await addDoc(collection(db, 'branches'), { name, createdAt: new Date().toISOString() });
  } catch (error) {
    console.error("Filial qo'shishda xatolik:", error);
  }
},

deleteBranch: async (id) => {
  try {
    await deleteDoc(doc(db, 'branches', id));
  } catch (error) {
    console.error("Filial o'chirishda xatolik:", error);
  }
},

listenToBranches: () => {
  const q = query(collection(db, 'branches'));
  onSnapshot(q, (snapshot) => {
    const fetchedBranches = snapshot.docs.map(doc => ({
      id: doc.id,
      name: doc.data().name,
    }));
    set({ branchesList: fetchedBranches });
  });
},
    }),
    {
      name: 'hodfood-storage',
      partialize: (state) => ({
        cart: state.cart,
        user: state.user,
        mode: state.mode,
        currentBranch: state.currentBranch,
      }),
    }
  )
);

useStore.getState().listenToOrders();
useStore.getState().listenToMenuItems();
useStore.getState().listenToUsers();
useStore.getState().listenToBranches();

async function setDoc(
  arg0: DocumentReference<DocumentData, DocumentData>,
  arg1: { uid: string; name: string; email: string; avatar: string; lastSeen: string; firstSeen: string; },
  arg2: { merge: boolean; }
) {
  const { setDoc: firestoreSetDoc } = await import('firebase/firestore');
  return firestoreSetDoc(arg0, arg1, arg2);
}
