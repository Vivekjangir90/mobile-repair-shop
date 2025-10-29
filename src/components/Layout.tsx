import React, { ReactNode, Dispatch, SetStateAction } from 'react';

// 'View' type को 'App.tsx' से यहाँ लाएँ
type View = 'dashboard' | 'repairs' | 'billing' | 'customers' | 'inventory';

// Layout Component के लिए Props Interface
interface LayoutProps {
  children: ReactNode; // यह component के अंदर का content है (जैसे Dashboard, Billing, आदि)
  setView: Dispatch<SetStateAction<View>>; // Navigation state setter function
  currentView: View; // Current active view
}

const Sidebar: React.FC<Pick<LayoutProps, 'setView' | 'currentView'>> = ({ setView, currentView }) => {
    // Navigation items
    const navItems: { view: View; name: string }[] = [
        { view: 'dashboard', name: 'Dashboard' },
        { view: 'repairs', name: 'Repair Jobs' },
        { view: 'billing', name: 'Billing' },
        { view: 'customers', name: 'Customers' },
        { view: 'inventory', name: 'Inventory' },
    ];

    return (
        <aside className="w-64 bg-gray-800 text-white flex-shrink-0 p-4">
            <h1 className="text-2xl font-bold mb-6 text-blue-400">PWA Shop</h1>
            <nav className="space-y-2">
                {navItems.map(item => (
                    <button
                        key={item.view}
                        onClick={() => setView(item.view)}
                        className={`w-full text-left py-2 px-3 rounded-lg transition duration-150 ${
                            currentView === item.view ? 'bg-blue-600 font-semibold' : 'hover:bg-gray-700'
                        }`}
                    >
                        {item.name}
                    </button>
                ))}
            </nav>
        </aside>
    );
};


const MainLayout: React.FC<LayoutProps> = ({ children, setView, currentView }) => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* 1. Sidebar */}
      <Sidebar setView={setView} currentView={currentView} />
      
      {/* 2. Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Header/Title can go here */}
        <header className="p-4 bg-white shadow-md border-b">
            <h2 className="text-xl font-medium text-gray-800 capitalize">
                {currentView}
            </h2>
        </header>
        <main className="p-6 flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout; // सुनिश्चित करें कि 'MainLayout' एक्सपोर्ट हो रहा है