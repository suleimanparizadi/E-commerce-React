import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { useCartStore } from '../../stores/cartStore';
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
  const [searchOpen, setSearchOpen] = useState(false);
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
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white shadow-sm px-4 py-3 flex items-center justify-between">
        <button onClick={() => setIsOpen(!isOpen)} className="p-2">
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
        <Link to="/" className="text-xl font-bold text-amado-dark">Laptop Store</Link>
        <div className="w-10" />
      </div>

      {/* Sidebar - Amado Style */}
      <aside
        className={`
          fixed top-0 right-0 h-full w-[320px] bg-white z-40
          transform transition-transform duration-500 ease-in-out
          ${isOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
          border-l border-gray-100 flex flex-col overflow-y-auto
        `}
      >
        {/* Close button - mobile only */}
        <button
          onClick={() => setIsOpen(false)}
          className="lg:hidden absolute top-4 left-4 p-2 text-amado-primary hover:text-amado-dark"
        >
          <X size={24} />
        </button>

        {/* Logo */}
        <div className="px-[75px] pt-[60px] pb-[100px]">
          <Link to="/" className="block">
            <h1 className="text-2xl font-bold tracking-tight text-amado-dark">Laptop Store</h1>
          </Link>
        </div>

        {/* Navigation - Amado Style */}
        <nav className="flex-1 px-[75px]">
          <ul className="space-y-0">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={`
                    relative block py-5 text-sm uppercase
                    transition-all duration-500
                    ${isActive(item.path)
                      ? 'text-amado-primary'
                      : 'text-amado-dark hover:text-amado-primary'
                    }
                  `}
                >
                  <span className="relative z-10">{item.label}</span>
                  {/* Amado hover line effect */}
                  <span
                    className={`
                      absolute top-1/2 -translate-y-1/2 right-[-75px] w-[30px] h-[3px] bg-amado-primary
                      transition-all duration-500
                      ${isActive(item.path) ? 'opacity-100' : 'opacity-0'}
                    `}
                  />
                  {item.badge > 0 && (
                    <span className="mr-2 bg-amado-primary text-white text-xs px-2 py-0.5">
                      {item.badge}
                    </span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* CTA Buttons - Amado Style */}
        <div className="px-[75px] py-4 space-y-3">
          <button className="w-full h-[55px] bg-amado-bg text-amado-dark text-sm uppercase font-normal hover:bg-gray-200 transition-colors">
            تخفیف ویژه
          </button>
          <button className="w-full h-[55px] bg-amado-dark text-white text-sm uppercase font-normal hover:bg-gray-800 transition-colors">
            جدید این هفته
          </button>
        </div>

        {/* Auth & Favorites - Amado Style */}
        <div className="px-[75px] py-6">
          <div className="space-y-4">
            {isAuthenticated ? (
              <>
                <Link
                  to="/profile"
                  className="flex items-center gap-3 text-sm uppercase text-amado-dark hover:text-amado-primary transition-colors"
                >
                  <User size={16} />
                  <span>
                    {user?.first_name} {user?.last_name}
                  </span>
                </Link>
                <button
                  onClick={() => { logout(); navigate('/'); }}
                  className="flex items-center gap-3 text-sm uppercase text-amado-dark hover:text-red-500 transition-colors w-full"
                >
                  <LogOut size={16} />
                  <span>خروج</span>
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-3 text-sm uppercase text-amado-dark hover:text-amado-primary transition-colors"
              >
                <LogIn size={16} />
                <span>ورود / ثبت نام</span>
              </Link>
            )}
            <button className="flex items-center gap-3 text-sm uppercase text-amado-dark hover:text-amado-primary transition-colors w-full">
              <Heart size={16} />
              <span>علاقه‌مندی‌ها</span>
            </button>
            <button
              onClick={() => setSearchOpen(true)}
              className="lg:hidden flex items-center gap-3 text-sm uppercase text-amado-dark hover:text-amado-primary transition-colors w-full"
            >
              <Search size={16} />
              <span>جستجو</span>
            </button>
          </div>
        </div>

        {/* Social links */}
        <div className="px-[75px] py-6">
          <div className="flex justify-start gap-4">
            {['I', 'T', 'W'].map((letter) => (
              <a
                key={letter}
                href="#"
                className="text-gray-400 hover:text-amado-primary transition-colors text-lg"
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