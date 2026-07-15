export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'Appetizers' | 'Mains' | 'Steaks' | 'Seafood' | 'Desserts' | 'Mocktails' | 'Beverages' | 'Breakfast';
  image: string;
  calories: number;
  ingredients: string[];
  rating: number;
  reviewsCount: number;
  isBestSeller?: boolean;
  isVegan?: boolean;
  isGlutenFree?: boolean;
  isChefSpecial?: boolean;
}

export interface Reservation {
  id: string;
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  guests: number;
  specialRequests?: string;
  status: 'Pending' | 'Confirmed' | 'Cancelled';
  tableNumber?: number;
  createdAt: string;
}

export interface OrderItem {
  menuItem: MenuItem;
  quantity: number;
}

export interface Order {
  id: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  deliveryFee: number;
  total: number;
  status: 'Pending' | 'Preparing' | 'Out for Delivery' | 'Ready for Pickup' | 'Completed';
  type: 'delivery' | 'pickup';
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  deliveryAddress?: string;
  couponUsed?: string;
  createdAt: string;
}

export interface Blog {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: 'Culinary Secrets' | 'Recipes' | 'Healthy Living' | 'Chef Journal';
  author: string;
  readTime: string;
  image: string;
  date: string;
  likes: number;
  commentsCount: number;
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  text: string;
  date: string;
  avatar: string;
  source: 'Google' | 'Verified Guest';
}

export interface Message {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}
