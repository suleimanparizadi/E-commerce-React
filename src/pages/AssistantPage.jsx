import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAssistant } from '../hooks/useAssistant';
import { Send, User, Bot, Loader2, Sparkles, ImageOff, MessageSquare, Zap, ChevronRight } from 'lucide-react';

// Renders either a plain string or a structured object { message, products }
function MessageContent({ content }) {
  if (typeof content === 'string') {
    return <p className="leading-relaxed">{content}</p>;
  }

  if (content && typeof content === 'object') {
    return (
      <div className="space-y-4">
        {content.message && <p className="leading-relaxed">{content.message}</p>}

        {Array.isArray(content.products) && content.products.length > 0 && (
          <div className="space-y-3 mt-4">
            <p className="text-xs font-bold text-blue-600 uppercase tracking-wider flex items-center gap-2">
              <span className="w-1 h-1 rounded-full bg-blue-600 inline-block"></span>
              محصولات پیشنهادی
            </p>
            <div className="grid gap-2">
              {content.products.map((product, i) => (
                <Link
                  key={i}
                  to={product.slug ? `/products/${product.slug}` : '#'}
                  className="flex items-center gap-3 bg-white rounded-xl border border-blue-100 p-3 hover:border-blue-300 hover:shadow-md transition-all duration-300 group"
                >
                  {product.thumbnail ? (
                    <div className="w-14 h-14 rounded-lg overflow-hidden bg-gray-50 border border-blue-50 shrink-0 group-hover:scale-105 transition-transform duration-300">
                      <img
                        src={product.thumbnail}
                        alt={product.name || ''}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.parentElement.nextSibling.style.display = 'flex';
                        }}
                      />
                    </div>
                  ) : (
                    <div className="w-14 h-14 rounded-lg bg-gray-50 flex items-center justify-center shrink-0 border border-blue-50">
                      <ImageOff size={20} className="text-gray-300" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-[#131212] truncate text-sm group-hover:text-blue-600 transition-colors">
                      {product.name || 'محصول نامشخص'}
                    </p>
                    {product.price !== undefined && (
                      <p className="text-xs text-blue-600 font-medium mt-0.5">
                        {new Intl.NumberFormat('fa-IR').format(product.price)} تومان
                      </p>
                    )}
                  </div>
                  <ChevronRight size={16} className="text-gray-300 group-hover:text-blue-500 group-hover:translate-x-0.5 transition-all" />
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  return <p className="leading-relaxed">{String(content)}</p>;
}

export default function AssistantPage() {
  const { chat } = useAssistant();
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'سلام! من دستیار هوشمند فروشگاه لپ‌تاپ هستم. چطور می‌توانم به شما کمک کنم؟ می‌توانید درباره مشخصات لپ‌تاپ، قیمت، یا پیشنهاد خرید از من سوال بپرسید.',
    },
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim() || chat.isPending) return;

    const userMessage = input.trim();
    setInput('');

    setMessages((prev) => [...prev, { role: 'user', content: userMessage }]);

    chat.mutate(
      { user_message: userMessage },
      {
        onSuccess: (answer) => {
          setMessages((prev) => [
            ...prev,
            { role: 'assistant', content: answer },
          ]);
        },
        onError: (error) => {
          const msg =
            error.response?.data?.question?.[0] ||
            error.response?.data?.message ||
            'مشکلی پیش آمد. لطفاً دوباره تلاش کنید.';
          setMessages((prev) => [
            ...prev,
            { role: 'assistant', content: msg },
          ]);
        },
      }
    );
  };

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] lg:h-[calc(100vh-40px)] px-4 lg:px-0 animate-fadeIn">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-blue-100 p-6 mb-4 flex items-center gap-4 shadow-lg shadow-blue-50 hover:shadow-xl transition-shadow duration-300">
        <div className="relative">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center shadow-lg shadow-blue-200">
            <Sparkles size={24} className="text-white" />
          </div>
          <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#fbb710] flex items-center justify-center shadow-md shadow-yellow-200">
            <Zap size={12} className="text-[#131212]" />
          </div>
        </div>
        <div className="flex-1">
          <h1 className="text-lg font-bold text-[#131212] flex items-center gap-2">
            دستیار هوشمند
            <span className="text-xs bg-blue-100 text-blue-600 px-2.5 py-1 rounded-full font-medium">
              AI
            </span>
          </h1>
          <p className="text-sm text-gray-400 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-pulse"></span>
            پاسخگوی سوالات شما درباره لپ‌تاپ
          </p>
        </div>
        {chat.isPending && (
          <div className="flex items-center gap-2 text-sm text-blue-600 bg-blue-50 px-4 py-2 rounded-full border border-blue-100">
            <Loader2 size={14} className="animate-spin" />
            <span className="font-medium">در حال تایپ...</span>
          </div>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto bg-white rounded-2xl border border-blue-100 p-6 mb-4 space-y-6 shadow-lg shadow-blue-50">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''} animate-slideDown`}
            style={{ animationDelay: `${idx * 50}ms` }}
          >
            {/* Avatar */}
            <div
              className={`
                w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 shadow-lg
                ${msg.role === 'user' 
                  ? 'bg-[#fbb710] shadow-yellow-200' 
                  : 'bg-gradient-to-br from-blue-600 to-blue-700 shadow-blue-200'
                }
                transition-transform duration-300 hover:scale-105
              `}
            >
              {msg.role === 'user' ? (
                <User size={20} className="text-[#131212]" />
              ) : (
                <Bot size={20} className="text-white" />
              )}
            </div>

            {/* Message bubble */}
            <div
              className={`
                max-w-[80%] p-5 rounded-2xl text-sm leading-relaxed shadow-sm
                ${msg.role === 'user'
                  ? 'bg-[#fbb710]/10 text-[#131212] border border-[#fbb710]/20'
                  : 'bg-blue-50/50 text-[#131212] border border-blue-100'
                }
                hover:shadow-md transition-shadow duration-300
              `}
            >
              <MessageContent content={msg.content} />
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
        
        {/* Empty state with typing indicator */}
        {chat.isPending && messages.length > 0 && (
          <div className="flex gap-4 animate-slideDown">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center shadow-lg shadow-blue-200">
              <Bot size={20} className="text-white" />
            </div>
            <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-5">
              <div className="flex gap-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '0ms' }}></span>
                <span className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '150ms' }}></span>
                <span className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '300ms' }}></span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl border border-blue-100 p-2 flex gap-3 shadow-lg shadow-blue-50 focus-within:shadow-xl focus-within:border-blue-300 transition-all duration-300"
      >
        <div className="relative flex-1">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="پیام خود را بنویسید..."
            className="w-full px-5 py-3.5 bg-blue-50/50 rounded-xl border-none text-[#131212] focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-300 placeholder:text-gray-400"
            disabled={chat.isPending}
          />
          {!input && !chat.isPending && (
            <MessageSquare size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
          )}
        </div>
        <button
          type="submit"
          disabled={!input.trim() || chat.isPending}
          className={`
            w-14 h-14 rounded-xl flex items-center justify-center transition-all duration-300
            ${!input.trim() || chat.isPending
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-[#131212] text-white hover:bg-gray-800 hover:scale-105 hover:shadow-lg shadow-gray-200'
            }
          `}
        >
          {chat.isPending ? (
            <Loader2 size={20} className="animate-spin" />
          ) : (
            <Send size={20} className={input.trim() ? 'group-hover:translate-x-0.5 transition-transform' : ''} />
          )}
        </button>
      </form>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes bounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-6px);
          }
        }
        .animate-slideDown {
          animation: slideDown 0.4s ease-out forwards;
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
        .animate-bounce {
          animation: bounce 1s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}