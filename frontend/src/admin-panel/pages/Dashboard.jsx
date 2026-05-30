import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  fetchAdminCategories,
  fetchAdminOrders,
  fetchAdminProducts,
} from '../utils/adminApi';

function StatIcon({ type, className }) {
  const icons = {
    orders: (
      <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
        <rect x="9" y="3" width="6" height="4" rx="1" />
      </svg>
    ),
    pending: (
      <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 6v6l4 2" />
      </svg>
    ),
    delivered: (
      <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M20 6 9 17l-5-5" />
      </svg>
    ),
    canceled: (
      <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M18 6 6 18M6 6l12 12" />
      </svg>
    ),
    box: (
      <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8Z" />
      </svg>
    ),
    tag: (
      <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82Z" />
      </svg>
    ),
  };
  return icons[type] || icons.box;
}

function isToday(dateStr) {
  const d = new Date(dateStr);
  const now = new Date();
  return (
    d.getDate() === now.getDate() &&
    d.getMonth() === now.getMonth() &&
    d.getFullYear() === now.getFullYear()
  );
}

function Dashboard() {
  const [productCount, setProductCount] = useState('—');
  const [categoryCount, setCategoryCount] = useState('—');
  const [todayOrders, setTodayOrders] = useState(0);
  const [todayPending, setTodayPending] = useState(0);
  const [todayDelivered, setTodayDelivered] = useState(0);
  const [todayCanceled, setTodayCanceled] = useState(0);

  useEffect(() => {
    Promise.all([fetchAdminProducts(), fetchAdminCategories(), fetchAdminOrders()])
      .then(([productsRes, categoriesRes, ordersRes]) => {
        setProductCount(String(productsRes.count ?? productsRes.data?.length ?? 0));
        setCategoryCount(String(categoriesRes.count ?? categoriesRes.data?.length ?? 0));

        const orders = ordersRes.data || [];
        const today = orders.filter((o) => isToday(o.createdAt));
        setTodayOrders(today.length);
        setTodayPending(today.filter((o) => o.status === 'pending').length);
        setTodayDelivered(today.filter((o) => o.status === 'delivered').length);
        setTodayCanceled(today.filter((o) => o.status === 'cancelled').length);
      })
      .catch(() => {});
  }, []);

  const todayStats = [
    { label: "Today's Orders", value: String(todayOrders), iconBg: 'bg-violet-100', iconColor: 'text-violet-600', icon: 'orders' },
    { label: "Today's Pending", value: String(todayPending), iconBg: 'bg-amber-100', iconColor: 'text-amber-600', icon: 'pending' },
    { label: "Today's Delivered", value: String(todayDelivered), iconBg: 'bg-emerald-100', iconColor: 'text-emerald-600', icon: 'delivered' },
    { label: "Today's Canceled", value: String(todayCanceled), iconBg: 'bg-red-100', iconColor: 'text-red-500', icon: 'canceled' },
  ];

  const monthlyBars = [
    { month: 'Jan', height: '45%' },
    { month: 'Feb', height: '62%' },
    { month: 'Mar', height: '38%' },
    { month: 'Apr', height: '78%' },
    { month: 'May', height: '55%' },
    { month: 'Jun', height: '90%' },
    { month: 'Jul', height: '48%' },
    { month: 'Aug', height: '70%' },
    { month: 'Sep', height: '58%' },
    { month: 'Oct', height: '82%' },
    { month: 'Nov', height: '65%' },
    { month: 'Dec', height: '72%' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {todayStats.map((stat) => (
          <div
            key={stat.label}
            className="flex items-center justify-between rounded-xl border border-black/8 bg-white p-5 shadow-sm"
          >
            <div>
              <p className="text-sm text-black/55">{stat.label}</p>
              <p className="mt-1 text-3xl font-semibold text-[#1a1d2e]">{stat.value}</p>
            </div>
            <div
              className={`flex h-12 w-12 items-center justify-center rounded-full ${stat.iconBg} ${stat.iconColor}`}
            >
              <StatIcon type={stat.icon} className="h-6 w-6" />
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="flex items-center justify-between rounded-xl border border-black/8 bg-white p-6 shadow-sm">
          <div>
            <p className="text-sm text-black/55">Total Products</p>
            <p className="mt-1 text-3xl font-semibold text-[#1a1d2e]">{productCount}</p>
            <Link to="/admin/products" className="mt-2 inline-block text-sm font-medium text-[#7c3aed] hover:underline">
              View All →
            </Link>
          </div>
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-violet-100 text-violet-600">
            <StatIcon type="box" className="h-7 w-7" />
          </div>
        </div>
        <div className="flex items-center justify-between rounded-xl border border-black/8 bg-white p-6 shadow-sm">
          <div>
            <p className="text-sm text-black/55">Total Categories</p>
            <p className="mt-1 text-3xl font-semibold text-[#1a1d2e]">{categoryCount}</p>
            <Link to="/admin/categories" className="mt-2 inline-block text-sm font-medium text-[#7c3aed] hover:underline">
              View All →
            </Link>
          </div>
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-violet-100 text-violet-600">
            <StatIcon type="tag" className="h-7 w-7" />
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-black/8 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-[#1a1d2e]">Monthly Sales</h2>
          <select
            className="rounded-lg border border-black/15 bg-white px-3 py-2 text-sm text-[#1a1d2e] outline-none focus:border-[#7c3aed]"
            defaultValue="2026"
          >
            <option value="2026">2026</option>
            <option value="2025">2025</option>
          </select>
        </div>
        <div className="mt-8 flex h-56 items-end justify-between gap-2 border-b border-black/10 pb-2">
          {monthlyBars.map((bar) => (
            <div key={bar.month} className="flex flex-1 flex-col items-center gap-2">
              <div
                className="w-full max-w-[40px] rounded-t-md bg-[#7c3aed]"
                style={{ height: bar.height }}
              />
              <span className="text-[10px] text-black/45 sm:text-xs">{bar.month}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
