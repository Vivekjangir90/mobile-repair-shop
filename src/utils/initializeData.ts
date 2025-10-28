import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase/config';

export const initializeSampleData = async () => {
  // Sample products/services
  const products = [
    {
      name: "Screen Replacement",
      category: "service",
      defaultPrice: 2000,
      currentPrice: 2000
    },
    {
      name: "Battery Replacement",
      category: "service",
      defaultPrice: 1500,
      currentPrice: 1500
    },
    {
      name: "Software Repair",
      category: "service",
      defaultPrice: 500,
      currentPrice: 500
    },
    {
      name: "Charging Port Repair",
      category: "service",
      defaultPrice: 800,
      currentPrice: 800
    },
    {
      name: "Mobile Charger",
      category: "accessory",
      defaultPrice: 300,
      currentPrice: 300,
      stockQuantity: 50,
      lowStockAlert: 10
    },
    {
      name: "USB Cable",
      category: "accessory",
      defaultPrice: 150,
      currentPrice: 150,
      stockQuantity: 100,
      lowStockAlert: 20
    },
    {
      name: "Mobile Case",
      category: "accessory",
      defaultPrice: 200,
      currentPrice: 200,
      stockQuantity: 75,
      lowStockAlert: 15
    },
    {
      name: "Screen Guard",
      category: "accessory",
      defaultPrice: 100,
      currentPrice: 100,
      stockQuantity: 120,
      lowStockAlert: 25
    }
  ];

  try {
    for (const product of products) {
      await addDoc(collection(db, 'products'), product);
    }
    console.log('Sample data initialized successfully');
  } catch (error) {
    console.error('Error initializing sample data:', error);
  }
};