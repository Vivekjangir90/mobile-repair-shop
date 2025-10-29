import React from 'react';
import { AppProvider } from './context/AppContext';
import MainLayout from './components/Layout'; // नाम 'Layout' या 'MainLayout' है

// Navigation component imports
import Dashboard from './components/Dashboard';
import Billing from './components/Billing';
import RepairManagement from './components/RepairManagement';
import Customers from './components/Customers';
import Inventory from './components/Inventory';

// Navigation State Type को यहाँ भी रखें
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
    
    return (
        // अब MainLayout प्रॉप्स (props) को स्वीकार करता है, इसलिए यह एरर ठीक हो गई है।
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