import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAssistant } from '../hooks/useAssistant';
import { Send, User, Bot, Loader2, Sparkles, ImageOff } from 'lucide-react';

// Renders either a plain string or a structured object { message, products }
function MessageContent({ content }) {
  if (typeof content === 'string') {
    return <p>{content}</p>;
  }

  if (content && typeof content === 'object') {
    return (
      <div className="space-y-3">
        {content.message && <p>{content.message}</p>}

        {Array.isArray(content.products) && content.products.length > 0 && (
          <div className="space-y-2 mt-2">
            <p className="text-xs font-bold text-blue-700 uppercase">محصولات پیشنهادی:</p>
            {content.products.map((product, i) => (
              <Link
                key={i}
                to={product.slug ? `/products/${product.slug}` : '#'}
                className="flex items-center gap-3 bg-white border border-blue-200 p-2 hover:bg-blue-100 transition-colors"
              >
                {product.thumbnail ? (
                  <img
                    src={product.thumbnail}
                    alt={product.name || ''}
                    className="w-12 h-12 object-cover bg-gray-50 shrink-0"
                  />
                ) : (
                  <div className="w-12 h-12 bg-gray-100 flex items-center justify-center shrink-0">
                    <ImageOff size={16} className="text-gray-400" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-blue-900 truncate text-sm">
                    {product.name || 'محصول نامشخص'}
                  </p>
                  {product.price !== undefined && (
                    <p className="text-xs text-blue-700">
                      {new Intl.NumberFormat('fa-IR').format(product.price)} تومان
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    );
  }

  return <p>{String(content)}</p>;
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
    <div className="flex flex-col h-[calc(100vh-80px)] lg:h-[calc(100vh-40px)] px-4 lg:px-0">
      {/* Header */}
      <div className="bg-white border border-gray-100 p-6 mb-4 flex items-center gap-4">
        <div className="w-12 h-12 bg-blue-600 flex items-center justify-center">
          <Sparkles size={24} className="text-white" />
        </div>
        <div>
          <h1 className="text-lg text-amado-dark font-normal uppercase">دستیار هوشمند</h1>
          <p className="text-xs text-gray-500">پاسخگوی سوالات شما درباره لپ‌تاپ</p>
        </div>
        {chat.isPending && (
          <span className="mr-auto text-xs text-gray-400 flex items-center gap-1">
            <Loader2 size={12} className="animate-spin" />
            در حال تایپ...
          </span>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto bg-white border border-gray-100 p-6 mb-4 space-y-6">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
          >
            {/* Avatar */}
            <div
              className={`w-10 h-10 flex items-center justify-center shrink-0 ${
                msg.role === 'user' ? 'bg-yellow-500' : 'bg-blue-600'
              }`}
            >
              {msg.role === 'user' ? (
                <User size={18} className="text-white" />
              ) : (
                <Bot size={18} className="text-white" />
              )}
            </div>

            {/* Message bubble */}
            <div
              className={`max-w-[80%] p-6 text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-yellow-100 text-yellow-900 border border-yellow-200'
                  : 'bg-blue-50 text-blue-900 border border-blue-100'
              }`}
            >
              <MessageContent content={msg.content} />
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form
        onSubmit={handleSubmit}
        className="bg-white border border-gray-100 p-4 flex gap-4"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="پیام خود را بنویسید..."
          className="flex-1 px-4 py-4 bg-amado-bg border-none text-amado-dark focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={chat.isPending}
        />
        <button
          type="submit"
          disabled={!input.trim() || chat.isPending}
          className="w-14 h-14 bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {chat.isPending ? (
            <Loader2 size={20} className="animate-spin" />
          ) : (
            <Send size={20} />
          )}
        </button>
      </form>
    </div>
  );
}