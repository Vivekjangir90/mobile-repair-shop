import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { Customer, RepairJob, Product, Sale, DashboardStats } from '../types';

interface AppState {
  customers: Customer[];
  repairJobs: RepairJob[];
  products: Product[];
  sales: Sale[];
  loading: boolean;
  searchTerm: string;
}

type AppAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_CUSTOMERS'; payload: Customer[] }
  | { type: 'SET_REPAIR_JOBS'; payload: RepairJob[] }
  | { type: 'SET_PRODUCTS'; payload: Product[] }
  | { type: 'SET_SALES'; payload: Sale[] }
  | { type: 'ADD_CUSTOMER'; payload: Customer }
  | { type: 'ADD_REPAIR_JOB'; payload: RepairJob }
  | { type: 'UPDATE_REPAIR_JOB'; payload: RepairJob }
  | { type: 'ADD_SALE'; payload: Sale }
  | { type: 'SET_SEARCH_TERM'; payload: string };

const initialState: AppState = {
  customers: [],
  repairJobs: [],
  products: [],
  sales: [],
  loading: false,
  searchTerm: ''
};

const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_CUSTOMERS':
      return { ...state, customers: action.payload };
    case 'SET_REPAIR_JOBS':
      return { ...state, repairJobs: action.payload };
    case 'SET_PRODUCTS':
      return { ...state, products: action.payload };
    case 'SET_SALES':
      return { ...state, sales: action.payload };
    case 'ADD_CUSTOMER':
      return { ...state, customers: [...state.customers, action.payload] };
    case 'ADD_REPAIR_JOB':
      return { ...state, repairJobs: [...state.repairJobs, action.payload] };
    case 'UPDATE_REPAIR_JOB':
      return {
        ...state,
        repairJobs: state.repairJobs.map(job =>
          job.id === action.payload.id ? action.payload : job
        )
      };
    case 'ADD_SALE':
      return { ...state, sales: [...state.sales, action.payload] };
    case 'SET_SEARCH_TERM':
      return { ...state, searchTerm: action.payload };
    default:
      return state;
  }
};

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} | null>(null);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};