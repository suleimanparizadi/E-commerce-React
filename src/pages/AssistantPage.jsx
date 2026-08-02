import { useState, useRef, useEffect } from 'react';
import { useAssistant } from '@/hooks/useAssistant';
import { Send, User, Bot, Loader2, Sparkles } from 'lucide-react';

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

    // Add user message immediately
    setMessages((prev) => [...prev, { role: 'user', content: userMessage }]);

    // Send to API
    chat.mutate(
      { user_message: userMessage },
      {
        onSuccess: (data) => {
          setMessages((prev) => [
            ...prev,
            { role: 'assistant', content: data.response || data },
          ]);
        },
        onError: () => {
          setMessages((prev) => [
            ...prev,
            {
              role: 'assistant',
              content: 'متأسفانه مشکلی پیش آمد. لطفاً دوباره تلاش کنید.',
            },
          ]);
        },
      }
    );
  };

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] lg:h-[calc(100vh-40px)]">
      {/* Header */}
      <div className="bg-white border border-gray-100 rounded-xl p-4 mb-4 flex items-center gap-3">
        <div className="w-10 h-10 bg-gray-900 rounded-full flex items-center justify-center">
          <Sparkles size={20} className="text-white" />
        </div>
        <div>
          <h1 className="font-bold text-gray-900">دستیار هوشمند</h1>
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
      <div className="flex-1 overflow-y-auto bg-white border border-gray-100 rounded-xl p-4 mb-4 space-y-4">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex gap-3 ${
              msg.role === 'user' ? 'flex-row-reverse' : ''
            }`}
          >
            {/* Avatar */}
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                msg.role === 'user' ? 'bg-gray-200' : 'bg-gray-900'
              }`}
            >
              {msg.role === 'user' ? (
                <User size={16} className="text-gray-600" />
              ) : (
                <Bot size={16} className="text-white" />
              )}
            </div>

            {/* Message bubble */}
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-gray-900 text-white rounded-tr-sm'
                  : 'bg-gray-100 text-gray-800 rounded-tl-sm'
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form
        onSubmit={handleSubmit}
        className="bg-white border border-gray-100 rounded-xl p-4 flex gap-3"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="پیام خود را بنویسید..."
          className="flex-1 px-4 py-3 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-gray-900"
          disabled={chat.isPending}
        />
        <button
          type="submit"
          disabled={!input.trim() || chat.isPending}
          className="w-12 h-12 bg-gray-900 text-white rounded-lg flex items-center justify-center hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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