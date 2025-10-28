import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Search, Phone, Mail, Calendar } from 'lucide-react';
import { formatDate } from '../utils/helpers';

const Customers: React.FC = () => {
  const { state } = useApp();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCustomers = state.customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone.includes(searchTerm) ||
    customer.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Customers</h1>
          <p className="text-gray-600">Manage customer database and repair history</p>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg shadow-sm border p-4">
        <div className="relative">
          <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search customers by name, phone, or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Customers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCustomers.map(customer => (
          <CustomerCard key={customer.id} customer={customer} />
        ))}
      </div>
    </div>
  );
};

const CustomerCard: React.FC<{ customer: any }> = ({ customer }) => {
  const { state } = useApp();
  const customerRepairs = state.repairJobs.filter(job => job.customerId === customer.id);

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{customer.name}</h3>
          <div className="flex items-center space-x-1 text-gray-500 mt-1">
            <Phone className="w-4 h-4" />
            <span className="text-sm">{customer.phone}</span>
          </div>
          {customer.email && (
            <div className="flex items-center space-x-1 text-gray-500 mt-1">
              <Mail className="w-4 h-4" />
              <span className="text-sm">{customer.email}</span>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Total Repairs:</span>
          <span className="font-medium">{customerRepairs.length}</span>
        </div>
        
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Pending Jobs:</span>
          <span className="font-medium text-orange-600">
            {customerRepairs.filter(job => job.status === 'pending' || job.status === 'in_progress').length}
          </span>
        </div>

        <div className="flex items-center space-x-1 text-sm text-gray-500">
          <Calendar className="w-4 h-4" />
          <span>Since {formatDate(customer.createdDate)}</span>
        </div>
      </div>

      {customerRepairs.length > 0 && (
        <div className="mt-4 pt-4 border-t">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Recent Repairs:</h4>
          <div className="space-y-2">
            {customerRepairs.slice(0, 2).map(repair => (
              <div key={repair.id} className="text-xs">
                <div className="flex justify-between">
                  <span className="font-medium">{repair.deviceBrand} {repair.deviceModel}</span>
                  <span className={`px-1 rounded ${getStatusColor(repair.status)}`}>
                    {repair.status.replace('_', ' ')}
                  </span>
                </div>
                <div className="text-gray-500 truncate">{repair.problemDescription}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

function getStatusColor(status: string): string {
  const colors = {
    pending: 'bg-yellow-100 text-yellow-800',
    in_progress: 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800',
    delivered: 'bg-purple-100 text-purple-800'
  };
  return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
}

export default Customers;