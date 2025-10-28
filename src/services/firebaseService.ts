import {
  collection,
  addDoc,
  updateDoc,
  doc,
  getDocs,
  query,
  where,
  orderBy,
  Timestamp
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebase/config';
import { Customer, RepairJob, Product, Sale } from '../types';

// Customer Services
export const customerService = {
  async getCustomers(): Promise<Customer[]> {
    const snapshot = await getDocs(collection(db, 'customers'));
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdDate: doc.data().createdDate.toDate()
    })) as Customer[];
  },

  async addCustomer(customer: Omit<Customer, 'id'>): Promise<string> {
    const docRef = await addDoc(collection(db, 'customers'), {
      ...customer,
      createdDate: Timestamp.now()
    });
    return docRef.id;
  },

  async findCustomerByPhone(phone: string): Promise<Customer | null> {
    const q = query(collection(db, 'customers'), where('phone', '==', phone));
    const snapshot = await getDocs(q);
    if (snapshot.empty) return null;
    const doc = snapshot.docs[0];
    return {
      id: doc.id,
      ...doc.data(),
      createdDate: doc.data().createdDate.toDate()
    } as Customer;
  }
};

// Repair Job Services
export const repairJobService = {
  async getRepairJobs(): Promise<RepairJob[]> {
    const snapshot = await getDocs(
      query(collection(db, 'repairJobs'), orderBy('createdDate', 'desc'))
    );
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdDate: doc.data().createdDate.toDate(),
      completedDate: doc.data().completedDate?.toDate()
    })) as RepairJob[];
  },

  async addRepairJob(job: Omit<RepairJob, 'id'>): Promise<string> {
    const docRef = await addDoc(collection(db, 'repairJobs'), {
      ...job,
      createdDate: Timestamp.now()
    });
    return docRef.id;
  },

  async updateRepairJob(id: string, updates: Partial<RepairJob>): Promise<void> {
    const docRef = doc(db, 'repairJobs', id);
    await updateDoc(docRef, updates);
  },

  async getRepairJobsByStatus(status: RepairJob['status']): Promise<RepairJob[]> {
    const q = query(
      collection(db, 'repairJobs'),
      where('status', '==', status),
      orderBy('createdDate', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdDate: doc.data().createdDate.toDate(),
      completedDate: doc.data().completedDate?.toDate()
    })) as RepairJob[];
  }
};

// Product Services
export const productService = {
  async getProducts(): Promise<Product[]> {
    const snapshot = await getDocs(collection(db, 'products'));
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Product[];
  },

  async updateProductStock(id: string, newQuantity: number): Promise<void> {
    const docRef = doc(db, 'products', id);
    await updateDoc(docRef, { stockQuantity: newQuantity });
  }
};

// Sales Services
export const saleService = {
  async addSale(sale: Omit<Sale, 'id'>): Promise<string> {
    const docRef = await addDoc(collection(db, 'sales'), {
      ...sale,
      date: Timestamp.now()
    });
    return docRef.id;
  },

  async getSales(): Promise<Sale[]> {
    const snapshot = await getDocs(
      query(collection(db, 'sales'), orderBy('date', 'desc'))
    );
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      date: doc.data().date.toDate()
    })) as Sale[];
  }
};

// File Upload Service
export const fileService = {
  async uploadPhoto(file: File, jobId: string): Promise<string> {
    const storageRef = ref(storage, `repair-jobs/${jobId}/${file.name}`);
    const snapshot = await uploadBytes(storageRef, file);
    return await getDownloadURL(snapshot.ref);
  }
};