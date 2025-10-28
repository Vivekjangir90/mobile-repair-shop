import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { repairJobService, saleService } from '../services/firebaseService';
import { DashboardStats, RepairJob } from '../types';
import { 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  DollarSign,
  AlertCircle
} from 'lucide-react';
import { formatCurrency, formatDate } from '../utils/helpers';

const Dashboard: React.FC = () => {
  const { state } = useApp();
  const [stats, setStats] = useState<DashboardStats>({
    todayRepairs: 0,
    pendingJobs: 0,
    completedToday: 0,
    revenueToday: 0
  });
  const [recentJobs, setRecentJobs] = useState<RepairJob[]>([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Calculate stats
    const todayRepairs = state.repairJobs.filter(job => 
      new Date(job.createdDate) >= today
    ).length;

    const pendingJobs = state.repairJobs.filter(job => 
      job.status === 'pending' || job.status === 'in_progress'
    ).length;

    const completedToday = state.repairJobs.filter(job => 
      job.status === 'completed' && job.completedDate && new Date(job.completedDate) >= today
    ).length;

    const todaySales = state.sales.filter(sale => 
      new Date(sale.date) >= today
    );
    
    const revenueToday = todaySales.reduce((total, sale) => total + sale.totalAmount, 0);

    setStats({
      todayRepairs,
      pendingJobs,
      completedToday,
      revenueToday
    });

    // Get recent jobs
    const recent = state.repairJobs.slice(0, 5);
    setRecentJobs(recent);
  };

  const StatCard: React.FC<{
    title: string;
    value: string | number;
    icon: React.ElementType;
    color: string;
  }> = ({ title, value, icon: Icon, color }) => (
    <div className="bg-white rounded-lg shadow-sm p-6 border">
      <div className="flex items-center">
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-semibold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Today's Repairs"
          value={stats.todayRepairs}
          icon={TrendingUp}
          color="bg-blue-500"
        />
        <StatCard
          title="Pending Jobs"
          value={stats.pendingJobs}
          icon={Clock}
          color="bg-yellow-500"
        />
        <StatCard
          title="Completed Today"
          value={stats.completedToday}
          icon={CheckCircle}
          color="bg-green-500"
        />
        <StatCard
          title="Today's Revenue"
          value={formatCurrency(stats.revenueToday)}
          icon={DollarSign}
          color="bg-purple-500"
        />
      </div>

      {/* Recent Repair Jobs */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="px-6 py-4 border-b">
          <h3 className="text-lg font-semibold text-gray-900">Recent Repair Jobs</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Device
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Problem
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentJobs.map((job) => (
                <tr key={job.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {job.customerName}
                      </div>
                      <div className="text-sm text-gray-500">
                        {job.customerPhone}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {job.deviceBrand} {job.deviceModel}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 max-w-xs truncate">
                      {job.problemDescription}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(job.status)}`}>
                      {job.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(new Date(job.createdDate))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
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

export default Dashboard;