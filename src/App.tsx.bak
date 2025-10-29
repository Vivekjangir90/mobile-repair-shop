import React from 'react';
import { AppProvider } from './context/AppContext';
import MainLayout from './components/Layout'; // Assuming you named your layout component MainLayout

// Navigation component imports
import Dashboard from './components/Dashboard';
import Billing from './components/Billing';
import RepairManagement from './components/RepairManagement';
import Customers from './components/Customers';
import Inventory from './components/Inventory';

// Simple Router state for demonstration
type View = 'dashboard' | 'repairs' | 'billing' | 'customers' | 'inventory';

const Router: React.FC<{ currentView: View }> = ({ currentView }) => {
    switch (currentView) {
        case 'repairs':
            return <RepairManagement />;
        case 'billing':
            return <Billing />;
        case 'customers':
            return <Customers />;
        case 'inventory':
            return <Inventory />;
        case 'dashboard':
        default:
            return <Dashboard />;
    }
};

const AppContent: React.FC = () => {
    const [currentView, setCurrentView] = React.useState<View>('dashboard');
    
    // NOTE: You need to pass setCurrentView down to your Sidebar/Header for navigation!
    
    return (
        // Assuming your MainLayout handles the sidebar and header structure
        <MainLayout setView={setCurrentView} currentView={currentView}>
            <Router currentView={currentView} />
        </MainLayout>
    );
};

const App: React.FC = () => {
    return (
        <AppProvider>
            <AppContent />
        </AppProvider>
    );
};

export default App;