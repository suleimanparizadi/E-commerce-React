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
  MessageCircle,
  Shield,
  ChevronLeft,
  Sparkles,
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
    { path: '/assistant', label: 'دستیار هوش مصنوعی', icon: MessageCircle, isSpecial: true },
    { path: '/products', label: 'جستجو', icon: Search },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* Mobile header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white shadow-lg shadow-blue-50 px-4 py-3 flex items-center justify-between border-b border-blue-100">
        <button onClick={() => setIsOpen(!isOpen)} className="p-2 hover:bg-blue-50 rounded-xl transition-colors">
          {isOpen ? <X size={24} className="text-[#131212]" /> : <Menu size={24} className="text-[#131212]" />}
        </button>
        <Link to="/" className="text-xl font-bold text-[#131212]">Laptop Store</Link>
        <div className="w-10" />
      </div>

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 right-0 h-full w-[320px] bg-white z-40
          transform transition-transform duration-500 ease-in-out
          ${isOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
          border-l border-blue-100 flex flex-col overflow-y-auto
          shadow-2xl shadow-blue-100/50
        `}
      >
        {/* Close button - mobile only */}
        <button
          onClick={() => setIsOpen(false)}
          className="lg:hidden absolute top-4 left-4 p-2 text-gray-400 hover:text-[#131212] transition-colors rounded-xl hover:bg-blue-50"
        >
          <X size={24} />
        </button>

        {/* Logo */}
        <div className="px-[75px] pt-[60px] pb-[80px]">
          <Link to="/" className="block">
            <img 
              src="https://c654815.parspack.net/c654815/resume_projects/ChatGPT%20Image%20Aug%204%2C%202026%2C%2011_33_37%20AM.png" 
              alt="Laptop Store Logo"
              className="w-full h-auto max-h-[78px] object-contain"
            />
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-[75px]">
          <ul className="space-y-0">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              const isSpecial = item.isSpecial;
              
              return (
                <li key={item.label}>
                  <Link
                    to={item.path}
                    onClick={() => setIsOpen(false)}
                    className={`
                      relative block py-4 text-base font-medium
                      transition-all duration-300
                      flex items-center gap-3
                      ${active
                        ? 'text-blue-600'
                        : isSpecial
                          ? 'text-[#131212] hover:text-blue-600 hover:bg-blue-50/80 rounded-xl transition-all duration-300'
                          : 'text-[#131212] hover:text-[#131212] hover:bg-[#fbb710]/10 rounded-xl transition-all duration-300'
                      }
                    `}
                  >
                    <Icon 
                      size={18} 
                      className={`
                        transition-colors duration-300
                        ${active 
                          ? 'text-blue-600' 
                          : isSpecial
                            ? 'text-gray-400 group-hover:text-blue-500'
                            : 'text-gray-400 group-hover:text-[#fbb710]'
                        }
                      `}
                    />
                    <span className="relative z-10">{item.label}</span>
                    
                    {/* Special badge for AI assistant */}
                    {isSpecial && (
                      <span className="text-[10px] bg-gradient-to-r from-blue-600 to-blue-700 text-white px-2 py-0.5 rounded-full font-bold shadow-md shadow-blue-200">
                        AI
                      </span>
                    )}
                    
                    {item.badge > 0 && (
                      <span className="mr-auto bg-[#fbb710] text-[#131212] text-xs font-bold px-2.5 py-0.5 rounded-full shadow-md shadow-yellow-200">
                        {item.badge}
                      </span>
                    )}

                    {/* Active indicator */}
                    {active && (
                      <span className="absolute right-[-75px] w-[30px] h-[3px] bg-blue-600 rounded-full" />
                    )}
                    
                    {/* Hover indicator line */}
                    {!active && (
                      <span className={`
                        absolute right-[-75px] w-[30px] h-[3px] rounded-full
                        transition-all duration-300 opacity-0 group-hover:opacity-100
                        ${isSpecial ? 'bg-blue-600' : 'bg-[#fbb710]'}
                      `} />
                    )}
                  </Link>
                </li>
              );
            })}
            
            {/* Contact Us */}
            <li>
              <button
                onClick={() => {
                  setIsOpen(false);
                  alert('تماس با ما:\nایمیل: info@laptopstore.ir\nتلفن: ۰۲۱-۱۲۳۴۵۶۷۸');
                }}
                className="relative block py-4 text-base font-medium text-[#131212] hover:bg-[#fbb710]/10 rounded-xl transition-all duration-300 w-full text-right flex items-center gap-3"
              >
                <span className="relative z-10">تماس با ما</span>
              </button>
            </li>
          </ul>
        </nav>

        {/* Auth Section */}
        <div className="px-[75px] py-6 border-t border-blue-100">
          <div className="space-y-3">
            {isAuthenticated ? (
              <>
                <Link
                  to="/profile"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 text-sm text-[#131212] hover:text-blue-600 transition-colors p-2 rounded-xl hover:bg-blue-50 group"
                >
                  <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center shadow-md shadow-blue-200">
                    <User size={14} className="text-white" />
                  </div>
                  <span className="font-medium">
                    {user?.first_name} {user?.last_name}
                  </span>
                </Link>

                {/* Admin Panel Link */}
                {user?.is_admin && (
                  <Link
                    to="/admin"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 text-sm text-[#131212] hover:text-blue-600 transition-colors p-2 rounded-xl hover:bg-blue-50 group"
                  >
                    <div className="w-8 h-8 rounded-xl bg-[#fbb710] flex items-center justify-center shadow-md shadow-yellow-200">
                      <Shield size={14} className="text-[#131212]" />
                    </div>
                    <span className="font-medium">پنل مدیریت</span>
                  </Link>
                )}

                <button
                  onClick={() => { logout(); navigate('/'); }}
                  className="flex items-center gap-3 text-sm text-[#131212] hover:text-red-500 transition-colors p-2 rounded-xl hover:bg-red-50 w-full group"
                >
                  <div className="w-8 h-8 rounded-xl bg-red-50 flex items-center justify-center group-hover:bg-red-100 transition-colors">
                    <LogOut size={14} className="text-red-400 group-hover:text-red-500 transition-colors" />
                  </div>
                  <span className="font-medium">خروج</span>
                </button>
              </>
            ) : (
              <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 text-sm text-[#131212] hover:text-blue-600 transition-colors p-2 rounded-xl hover:bg-blue-50 group"
              >
                <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center shadow-md shadow-blue-200">
                  <LogIn size={14} className="text-white" />
                </div>
                <span className="font-medium">ورود / ثبت نام</span>
              </Link>
            )}
          </div>
        </div>

        {/* Social links */}
        <div className="px-[75px] py-4 border-t border-blue-100">
          <div className="flex justify-start gap-3">
            {['I', 'T', 'W'].map((letter) => (
              <a
                key={letter}
                href="#"
                className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center text-gray-400 hover:bg-[#fbb710] hover:text-[#131212] transition-all duration-300 hover:scale-110 font-bold text-sm"
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
          className="lg:hidden fixed inset-0 bg-black/40 backdrop-blur-sm z-30 animate-fadeIn"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
      `}</style>
    </>
  );
}