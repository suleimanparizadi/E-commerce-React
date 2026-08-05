import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  HelpCircle,
  LogOut,
  Menu,
  X,
  ChevronLeft,
  ArrowLeft,
} from 'lucide-react';

const adminNavItems = [
  { path: '/admin', label: 'داشبورد', icon: LayoutDashboard },
  { path: '/admin/products', label: 'محصولات', icon: Package },
  { path: '/admin/orders', label: 'سفارش‌ها', icon: ShoppingBag },
  { path: '/admin/users', label: 'کاربران', icon: Users },
  { path: '/admin/faq', label: 'سوالات متداول', icon: HelpCircle },
];

export function AdminSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuthStore();

  const isActive = (path) => {
    if (path === '/admin') return location.pathname === '/admin';
    return location.pathname.startsWith(path);
  };

  return (
    <>
      {/* Mobile header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white shadow-sm px-4 py-3 flex items-center justify-between">
        <button onClick={() => setIsOpen(!isOpen)} className="p-2">
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
        <span className="text-lg font-bold text-[#131212]">پنل مدیریت</span>
        <div className="w-10" />
      </div>

      {/* Admin Sidebar */}
      <aside
        className={`
          fixed top-0 right-0 h-full w-[280px] bg-white z-40
          transform transition-transform duration-500 ease-in-out
          ${isOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
          border-l border-gray-200 flex flex-col overflow-y-auto shadow-lg
        `}
      >
        {/* Close button - mobile only */}
        <button
          onClick={() => setIsOpen(false)}
          className="lg:hidden absolute top-4 left-4 p-2 text-gray-500 hover:text-[#131212]"
        >
          <X size={24} />
        </button>

        {/* Logo / Header */}
        <div className="px-8 pt-10 pb-8">
          <Link to="/admin" className="block" onClick={() => setIsOpen(false)}>
            <h1 className="text-xl font-bold text-[#131212]">پنل مدیریت</h1>
            <p className="text-xs text-gray-400 mt-1">Laptop Store Admin</p>
          </Link>
        </div>

        {/* Admin Info */}
        <div className="px-8 pb-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#131212] flex items-center justify-center text-white text-sm font-medium">
              {user?.first_name?.[0] || user?.last_name?.[0] || 'A'}
            </div>
            <div>
              <p className="text-sm font-medium text-[#131212]">
                {user?.first_name} {user?.last_name}
              </p>
              <p className="text-xs text-gray-400">مدیر سیستم</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6">
          <ul className="space-y-1">
            {adminNavItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    onClick={() => setIsOpen(false)}
                    className={`
                      flex items-center gap-3 px-4 py-3 rounded-lg text-sm
                      transition-all duration-300
                      ${active
                        ? 'bg-[#131212] text-white'
                        : 'text-gray-600 hover:bg-gray-100'
                      }
                    `}
                  >
                    <Icon size={18} />
                    <span>{item.label}</span>
                    {active && <ChevronLeft size={14} className="mr-auto" />}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Back to site + Logout */}
        <div className="px-4 py-6 border-t border-gray-100 space-y-2">
          <Link
            to="/"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-gray-600 hover:bg-gray-100 transition-all duration-300"
          >
            <ArrowLeft size={18} />
            <span>بازگشت به سایت</span>
          </Link>
          <button
            onClick={() => { logout(); navigate('/'); }}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-red-500 hover:bg-red-50 transition-all duration-300 w-full"
          >
            <LogOut size={18} />
            <span>خروج</span>
          </button>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}