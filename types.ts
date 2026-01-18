export type Role = 'CLIENT' | 'PROVIDER';

export type ServiceStatus = 'DRAFT' | 'MATCHING' | 'IN_PROGRESS' | 'COMPLETED';

export interface ServiceCategory {
  id: string;
  name: string;
  icon: string;
}

export interface Worker {
  id: string;
  name: string;
  avatar: string;
  title: string;
  tags: string[]; // Character tags (e.g., Real name, Health cert)
  rating: number;
  price: number; // Hourly price
  distance: string;
  age: number;
  experience: number; // Years
  productName?: string; // e.g., "Deep Cleaning Package"
  productTags?: string[]; // e.g., "Glass cleaning", "Polishing"
  unreadMessages?: number; // Added: Number of unread chat messages
}

export interface Order {
  id: string;
  clientName: string;
  clientAvatar: string;
  serviceType: string;
  summary: string;
  time: string;
  distance: string;
  address: string; // Added address field
  status: 'PENDING' | 'WAITING_CONFIRMATION' | 'MATCHED' | 'COMPLETED';
  unreadMessages?: number; // Added: Number of unread chat messages
}