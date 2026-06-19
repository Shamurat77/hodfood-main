import type { MenuItem } from '../types';

export const BRANCHES = ['Chilonzor', 'Yunusobod', 'Sergeli', 'Olmazor'];

export const INITIAL_MENU: MenuItem[] = [
  { id: 'hd1', name: 'Ultra Hot-dog', price: 30000, category: 'hotdog' },
  { id: 'hd2', name: 'Katta Hot-dog', price: 25000, category: 'hotdog' },
  { id: 'hd3', name: "O'rtacha Hot-dog", price: 20000, category: 'hotdog' },
  { id: 'hd4', name: 'Kichkina Hot-dog', price: 13000, category: 'hotdog' },
  { id: 'hd5', name: 'Hot Doger', price: 30000, category: 'hotdog' },
  { id: 'bg1', name: 'Dabl Chiz Burger', price: 35000, category: 'burger' },
  { id: 'bg2', name: 'Chiz Burger', price: 27000, category: 'burger' },
  { id: 'bg3', name: 'Klassik Burger', price: 24000, category: 'burger' },
  { id: 'bg4', name: 'Tovuqli Chiz Burger', price: 26000, category: 'burger' },
  { id: 'sn1', name: 'Fri sous bilan', price: 15000, category: 'snack' },
  { id: 'dr1', name: 'Coca-Cola', price: 10000, category: 'drink' },
  { id: 'dr2', name: 'Fanta', price: 10000, category: 'drink' },
  { id: 'dr3', name: 'Ice Tea', price: 8000, category: 'drink' },
  { id: 'dr4', name: 'Oddiy suv', price: 5000, category: 'drink' },
];

export const CATEGORY_LABELS: Record<string, string> = {
  hotdog: 'Hot-doglar',
  burger: 'Burgerlar',
  snack: 'Sneklar',
  drink: 'Ichimliklar',
};

export const CATEGORY_EMOJIS: Record<string, string> = {
  all: '🍽️',
  hotdog: '🌭',
  burger: '🍔',
  snack: '🍟',
  drink: '🥤',
};

export const STATUS_LABELS: Record<string, string> = {
  new: 'Yangi',
  preparing: 'Tayyorlanmoqda',
  onway: "Yo'lda",
  completed: 'Yakunlandi',
};
