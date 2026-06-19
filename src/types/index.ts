export type Category = 'hotdog' | 'burger' | 'snack' | 'drink';
export type OrderStatus = 'new' | 'preparing' | 'onway' | 'completed';
export type AppMode = 'customer' | 'branch' | 'admin';
export type AdminSection = 'dashboard' | 'menu' | 'branches' | 'history';
export type PaymentMethod = 'cash' | 'card';
export type OrderType = 'delivery' | 'pickup';
export type StatsFilter = 'daily' | 'weekly' | 'monthly';

export interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: Category;
}

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
  spicySauce: boolean;
}

export interface Order {
  id: string;
  items: CartItem[];
  customerName: string;
  phone: string;
  address: string;
  orderType: OrderType;
  paymentMethod: PaymentMethod;
  cardNumber?: string;
  expiryDate?: string;
  branch: string;
  status: OrderStatus;
  createdAt: Date;
  total: number;
}

export interface User {
  name: string;
  email: string;
  avatar: string;
}
