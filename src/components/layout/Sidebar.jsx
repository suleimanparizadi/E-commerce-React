import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { useCartStore } from '@/stores/cartStore';
import {
  Home,
  ShoppingBag,
  ShoppingCart,
  Package,
  User,
  LogIn,
  LogOut,
  Menu,
  X,
  Search,
  Heart,
  MessageCircle,
} from 'lucide-react';

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuthStore();
  const itemCount = useCartStore((state) => state.itemCount);

  const navItems = [
    { path: '/', label: 'صفحه اصلی', icon: Home },
    { path: '/products', label: 'فروشگاه', icon: ShoppingBag },
    { path: '/cart', label: 'سبد خرید', icon: ShoppingCart, badge: itemCount },
    { path: '/orders', label: 'سفارشات', icon: Package },
    { path: '/assistant', label: 'دستیار هوشمند', icon: MessageCircle },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* Mobile header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <button onClick={() => setIsOpen(!isOpen)} className="p-2">
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
        <Link to="/" className="text-xl font-bold">Laptop Store</Link>
        <div className="w-10" />
      </div>

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 right-0 h-full w-[280px] bg-white z-40
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
          border-l border-gray-200 flex flex-col shadow-lg lg:shadow-none
        `}
      >
        {/* Close button - mobile only */}
        <button
          onClick={() => setIsOpen(false)}
          className="lg:hidden absolute top-4 left-4 p-2"
        >
          <X size={24} />
        </button>

        {/* Logo */}
        <div className="px-8 pt-10 pb-6">
          <Link to="/" className="block">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">Laptop Store</h1>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-6">
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
                    ${isActive(item.path)
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                    }
                  `}
                >
                  <item.icon size={18} />
                  <span className="font-medium">{item.label}</span>
                  {item.badge > 0 && (
                    <span className="mr-auto bg-amber-500 text-white text-xs px-2 py-0.5 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* CTA Buttons */}
        <div className="px-6 py-4 space-y-2">
          <button className="w-full bg-gray-100 text-gray-800 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors">
            تخفیف ویژه
          </button>
          <button className="w-full bg-gray-900 text-white py-3 px-4 rounded-lg font-medium hover:bg-gray-800 transition-colors">
            جدید این هفته
          </button>
        </div>

        {/* Auth & Favorites */}
        <div className="px-6 py-4 border-t border-gray-200">
          <div className="space-y-2">
            {isAuthenticated ? (
              <>
                <Link
                  to="/profile"
                  className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:text-gray-900 transition-colors"
                >
                  <User size={18} />
                  <span className="text-sm">
                    {user?.first_name} {user?.last_name}
                  </span>
                </Link>
                <button
                  onClick={() => { logout(); navigate('/'); }}
                  className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:text-red-600 transition-colors w-full"
                >
                  <LogOut size={18} />
                  <span className="text-sm">خروج</span>
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:text-gray-900 transition-colors"
              >
                <LogIn size={18} />
                <span className="text-sm">ورود / ثبت نام</span>
              </Link>
            )}
            <button className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:text-gray-900 transition-colors w-full">
              <Heart size={18} />
              <span className="text-sm">علاقه‌مندی‌ها</span>
            </button>
          </div>
        </div>

        {/* Social links */}
        <div className="px-6 py-4 border-t border-gray-200">
          <div className="flex justify-center gap-4">
            {['I', 'T', 'W'].map((letter) => (
              <a
                key={letter}
                href="#"
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-900 hover:text-white transition-colors text-xs font-bold"
              >
                {letter}
              </a>
            ))}
          </div>
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